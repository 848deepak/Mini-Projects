package com.miniprojects.trading.model;

import java.math.BigDecimal;

public class Asset {

  private final String symbol;
  private final String exchange;
  private BigDecimal lastPrice;

  public Asset(String symbol, String exchange, BigDecimal lastPrice) {
    this.symbol = symbol;
    this.exchange = exchange;
    this.lastPrice = lastPrice;
  }

  public String getSymbol() {
    return symbol;
  }

  public String getExchange() {
    return exchange;
  }

  public BigDecimal getLastPrice() {
    return lastPrice;
  }

  public void setLastPrice(BigDecimal lastPrice) {
    this.lastPrice = lastPrice;
  }
}
