package com.miniprojects.trading.model;

import java.math.BigDecimal;
import java.time.Instant;

public class TradingOrder {

  public enum Side { BUY, SELL }
  public enum Type { MARKET, LIMIT }
  public enum Status { OPEN, PARTIAL, FILLED, REJECTED }

  private final String id;
  private final String userId;
  private final String symbol;
  private final Side side;
  private final Type type;
  private final int quantity;
  private final BigDecimal limitPrice;
  private final Instant createdAt;
  private Status status;
  private int filledQuantity;

  public TradingOrder(String id, String userId, String symbol, Side side, Type type, int quantity, BigDecimal limitPrice, Instant createdAt) {
    this.id = id;
    this.userId = userId;
    this.symbol = symbol;
    this.side = side;
    this.type = type;
    this.quantity = quantity;
    this.limitPrice = limitPrice;
    this.createdAt = createdAt;
    this.status = Status.OPEN;
  }

  public String getId() { return id; }
  public String getUserId() { return userId; }
  public String getSymbol() { return symbol; }
  public Side getSide() { return side; }
  public Type getType() { return type; }
  public int getQuantity() { return quantity; }
  public BigDecimal getLimitPrice() { return limitPrice; }
  public Instant getCreatedAt() { return createdAt; }
  public Status getStatus() { return status; }
  public void setStatus(Status status) { this.status = status; }
  public int getFilledQuantity() { return filledQuantity; }
  public void setFilledQuantity(int filledQuantity) { this.filledQuantity = filledQuantity; }
}
