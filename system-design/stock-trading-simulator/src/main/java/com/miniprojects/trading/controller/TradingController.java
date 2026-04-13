package com.miniprojects.trading.controller;

import com.miniprojects.trading.dto.MarketTickRequest;
import com.miniprojects.trading.dto.OrderResponse;
import com.miniprojects.trading.dto.PortfolioResponse;
import com.miniprojects.trading.dto.SubmitOrderRequest;
import com.miniprojects.trading.model.MarketTick;
import com.miniprojects.trading.service.TradingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api")
public class TradingController {

  private final TradingService tradingService;

  public TradingController(TradingService tradingService) {
    this.tradingService = tradingService;
  }

  @PostMapping("/market/ticks")
  @ResponseStatus(HttpStatus.CREATED)
  public MarketTick ingestTick(@Valid @RequestBody MarketTickRequest request) {
    return tradingService.ingestTick(request);
  }

  @GetMapping("/market/{symbol}/ticks")
  public Collection<MarketTick> getTicks(@PathVariable String symbol) {
    return tradingService.getTicks(symbol);
  }

  @PostMapping("/orders")
  @ResponseStatus(HttpStatus.CREATED)
  public OrderResponse submitOrder(@Valid @RequestBody SubmitOrderRequest request) {
    return tradingService.submitOrder(request);
  }

  @GetMapping("/orders")
  public Collection<OrderResponse> listOrders() {
    return tradingService.listOrders();
  }

  @GetMapping("/orders/{orderId}")
  public OrderResponse getOrder(@PathVariable String orderId) {
    return tradingService.getOrder(orderId);
  }

  @GetMapping("/portfolios/{userId}")
  public PortfolioResponse getPortfolio(@PathVariable String userId) {
    return tradingService.getPortfolio(userId);
  }
}
