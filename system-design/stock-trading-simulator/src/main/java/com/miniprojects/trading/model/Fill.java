package com.miniprojects.trading.model;

import java.math.BigDecimal;
import java.time.Instant;

public class Fill {

  private final String id;
  private final String orderId;
  private final String symbol;
  private final BigDecimal price;
  private final int quantity;
  private final Instant createdAt;

  public Fill(String id, String orderId, String symbol, BigDecimal price, int quantity, Instant createdAt) {
    this.id = id;
    this.orderId = orderId;
    this.symbol = symbol;
    this.price = price;
    this.quantity = quantity;
    this.createdAt = createdAt;
  }

  public String getId() { return id; }
  public String getOrderId() { return orderId; }
  public String getSymbol() { return symbol; }
  public BigDecimal getPrice() { return price; }
  public int getQuantity() { return quantity; }
  public Instant getCreatedAt() { return createdAt; }
}
