package com.miniprojects.trading.service;

import com.miniprojects.trading.dto.MarketTickRequest;
import com.miniprojects.trading.dto.OrderResponse;
import com.miniprojects.trading.dto.PortfolioResponse;
import com.miniprojects.trading.dto.SubmitOrderRequest;
import com.miniprojects.trading.exception.ConflictException;
import com.miniprojects.trading.exception.NotFoundException;
import com.miniprojects.trading.model.Asset;
import com.miniprojects.trading.model.Fill;
import com.miniprojects.trading.model.Holding;
import com.miniprojects.trading.model.MarketTick;
import com.miniprojects.trading.model.Portfolio;
import com.miniprojects.trading.model.TradingOrder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TradingService {

  private final Map<String, Asset> assets = new ConcurrentHashMap<>();
  private final Map<String, List<MarketTick>> ticksBySymbol = new ConcurrentHashMap<>();
  private final Map<String, TradingOrder> orders = new ConcurrentHashMap<>();
  private final Map<String, List<Fill>> fillsByOrder = new ConcurrentHashMap<>();
  private final Map<String, Portfolio> portfolios = new ConcurrentHashMap<>();
  private final Map<String, Map<String, Holding>> holdingsByUser = new ConcurrentHashMap<>();
  private final AtomicLong sequence = new AtomicLong(8_000);

  public TradingService() {
    seed();
  }

  public synchronized MarketTick ingestTick(MarketTickRequest request) {
    Asset asset = assets.computeIfAbsent(request.symbol().toUpperCase(), symbol -> new Asset(symbol, "NSE", normalizeMoney(request.price())));
    asset.setLastPrice(normalizeMoney(request.price()));
    MarketTick tick = new MarketTick(nextId("tick"), asset.getSymbol(), asset.getLastPrice(), request.volume(), Instant.now());
    ticksBySymbol.computeIfAbsent(asset.getSymbol(), ignored -> new ArrayList<>()).add(0, tick);
    recalculatePortfolios();
    return tick;
  }

  public synchronized OrderResponse submitOrder(SubmitOrderRequest request) {
    Asset asset = assets.get(request.symbol().toUpperCase());
    if (asset == null) {
      throw new NotFoundException("Asset not found: " + request.symbol());
    }

    if (request.type() == TradingOrder.Type.LIMIT && request.limitPrice() == null) {
      throw new IllegalArgumentException("Limit price is required for limit orders");
    }

    TradingOrder order = new TradingOrder(
      nextId("ord"),
      request.userId(),
      asset.getSymbol(),
      request.side(),
      request.type(),
      request.quantity(),
      request.limitPrice() == null ? null : normalizeMoney(request.limitPrice()),
      Instant.now()
    );

    orders.put(order.getId(), order);
    executeOrder(order, asset);
    recalculatePortfolios();
    return toOrderResponse(order);
  }

  public Collection<OrderResponse> listOrders() {
    return orders.values().stream().map(this::toOrderResponse).sorted(Comparator.comparing(OrderResponse::createdAt).reversed()).toList();
  }

  public OrderResponse getOrder(String orderId) {
    return toOrderResponse(findOrder(orderId));
  }

  public PortfolioResponse getPortfolio(String userId) {
    Portfolio portfolio = portfolios.get(userId);
    if (portfolio == null) {
      throw new NotFoundException("Portfolio not found: " + userId);
    }
    Map<String, Integer> holdings = holdingsByUser.getOrDefault(userId, Map.of()).entrySet().stream().collect(LinkedHashMap::new, (map, entry) -> map.put(entry.getKey(), entry.getValue().getQuantity()), Map::putAll);
    return new PortfolioResponse(portfolio.getUserId(), portfolio.getCashBalance(), portfolio.getMarketValue(), portfolio.getPnl(), holdings);
  }

  public Collection<MarketTick> getTicks(String symbol) {
    return ticksBySymbol.getOrDefault(symbol.toUpperCase(), List.of());
  }

  private void executeOrder(TradingOrder order, Asset asset) {
    BigDecimal marketPrice = asset.getLastPrice();
    BigDecimal executionPrice = marketPrice;

    if (order.getType() == TradingOrder.Type.LIMIT) {
      if (order.getSide() == TradingOrder.Side.BUY && marketPrice.compareTo(order.getLimitPrice()) > 0) {
        order.setStatus(TradingOrder.Status.REJECTED);
        return;
      }
      if (order.getSide() == TradingOrder.Side.SELL && marketPrice.compareTo(order.getLimitPrice()) < 0) {
        order.setStatus(TradingOrder.Status.REJECTED);
        return;
      }
      executionPrice = order.getLimitPrice();
    }

    Portfolio portfolio = portfolios.computeIfAbsent(order.getUserId(), userId -> new Portfolio(userId, new BigDecimal("100000.00"), BigDecimal.ZERO, BigDecimal.ZERO));
    Map<String, Holding> holdings = holdingsByUser.computeIfAbsent(order.getUserId(), ignored -> new ConcurrentHashMap<>());
    Holding holding = holdings.getOrDefault(order.getSymbol(), new Holding(order.getSymbol(), 0, BigDecimal.ZERO));

    if (order.getSide() == TradingOrder.Side.BUY) {
      BigDecimal totalCost = executionPrice.multiply(BigDecimal.valueOf(order.getQuantity()));
      if (portfolio.getCashBalance().compareTo(totalCost) < 0) {
        order.setStatus(TradingOrder.Status.REJECTED);
        throw new ConflictException("Insufficient cash balance");
      }

      portfolio.setCashBalance(normalizeMoney(portfolio.getCashBalance().subtract(totalCost)));
      int newQuantity = holding.getQuantity() + order.getQuantity();
      BigDecimal newAverageCost = newQuantity == 0
        ? BigDecimal.ZERO
        : executionPrice.multiply(BigDecimal.valueOf(order.getQuantity())).add(holding.getAverageCost().multiply(BigDecimal.valueOf(holding.getQuantity()))).divide(BigDecimal.valueOf(newQuantity), 2, RoundingMode.HALF_UP);
      holding.setQuantity(newQuantity);
      holding.setAverageCost(newAverageCost);
      holdings.put(order.getSymbol(), holding);
      createFill(order, executionPrice, order.getQuantity());
      order.setFilledQuantity(order.getQuantity());
      order.setStatus(TradingOrder.Status.FILLED);
      return;
    }

    if (holding.getQuantity() < order.getQuantity()) {
      order.setStatus(TradingOrder.Status.REJECTED);
      throw new ConflictException("Insufficient holdings to sell");
    }

    BigDecimal proceeds = executionPrice.multiply(BigDecimal.valueOf(order.getQuantity()));
    portfolio.setCashBalance(normalizeMoney(portfolio.getCashBalance().add(proceeds)));
    holding.setQuantity(holding.getQuantity() - order.getQuantity());
    if (holding.getQuantity() == 0) {
      holdings.remove(order.getSymbol());
    } else {
      holdings.put(order.getSymbol(), holding);
    }
    createFill(order, executionPrice, order.getQuantity());
    order.setFilledQuantity(order.getQuantity());
    order.setStatus(TradingOrder.Status.FILLED);
  }

  private void createFill(TradingOrder order, BigDecimal price, int quantity) {
    Fill fill = new Fill(nextId("fill"), order.getId(), order.getSymbol(), price, quantity, Instant.now());
    fillsByOrder.computeIfAbsent(order.getId(), ignored -> new ArrayList<>()).add(fill);
  }

  private void recalculatePortfolios() {
    for (Map.Entry<String, Portfolio> entry : portfolios.entrySet()) {
      String userId = entry.getKey();
      Portfolio portfolio = entry.getValue();
      BigDecimal marketValue = BigDecimal.ZERO;
      Map<String, Holding> holdings = holdingsByUser.getOrDefault(userId, Map.of());
      for (Holding holding : holdings.values()) {
        Asset asset = assets.get(holding.getSymbol());
        if (asset != null) {
          marketValue = marketValue.add(asset.getLastPrice().multiply(BigDecimal.valueOf(holding.getQuantity())));
        }
      }
      portfolio.setMarketValue(normalizeMoney(marketValue));
      portfolio.setPnl(normalizeMoney(marketValue.add(portfolio.getCashBalance()).subtract(new BigDecimal("100000.00"))));
    }
  }

  private TradingOrder findOrder(String orderId) {
    TradingOrder order = orders.get(orderId);
    if (order == null) {
      throw new NotFoundException("Order not found: " + orderId);
    }
    return order;
  }

  private OrderResponse toOrderResponse(TradingOrder order) {
    return new OrderResponse(order.getId(), order.getUserId(), order.getSymbol(), order.getSide(), order.getType(), order.getQuantity(), order.getLimitPrice(), order.getStatus(), order.getFilledQuantity(), order.getCreatedAt());
  }

  private BigDecimal normalizeMoney(BigDecimal amount) {
    return amount.setScale(2, RoundingMode.HALF_UP);
  }

  private String nextId(String prefix) {
    return prefix + "-" + sequence.incrementAndGet();
  }

  private void seed() {
    assets.put("AAPL", new Asset("AAPL", "NASDAQ", new BigDecimal("192.33")));
    assets.put("TSLA", new Asset("TSLA", "NASDAQ", new BigDecimal("245.10")));
    assets.put("MSFT", new Asset("MSFT", "NASDAQ", new BigDecimal("418.70")));
    portfolios.put("user-1", new Portfolio("user-1", new BigDecimal("100000.00"), BigDecimal.ZERO, BigDecimal.ZERO));
    portfolios.put("user-2", new Portfolio("user-2", new BigDecimal("100000.00"), BigDecimal.ZERO, BigDecimal.ZERO));
  }
}
