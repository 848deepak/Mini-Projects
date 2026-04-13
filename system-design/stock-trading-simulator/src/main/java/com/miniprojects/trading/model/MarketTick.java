package com.miniprojects.trading.model;

import java.math.BigDecimal;
import java.time.Instant;

public class MarketTick {

  private final String id;
  private final String symbol;
  private final BigDecimal price;
  private final long volume;
  private final Instant occurredAt;

  public MarketTick(String id, String symbol, BigDecimal price, long volume, Instant occurredAt) {
    this.id = id;
    this.symbol = symbol;
    this.price = price;
    this.volume = volume;
    this.occurredAt = occurredAt;
  }

  public String getId() {
    return id;
  }

  public String getSymbol() {
    return symbol;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public long getVolume() {
    return volume;
  }

  public Instant getOccurredAt() {
    return occurredAt;
  }
}
