package com.miniprojects.trading.model;

import java.math.BigDecimal;

public class Holding {

  private final String symbol;
  private int quantity;
  private BigDecimal averageCost;

  public Holding(String symbol, int quantity, BigDecimal averageCost) {
    this.symbol = symbol;
    this.quantity = quantity;
    this.averageCost = averageCost;
  }

  public String getSymbol() { return symbol; }
  public int getQuantity() { return quantity; }
  public void setQuantity(int quantity) { this.quantity = quantity; }
  public BigDecimal getAverageCost() { return averageCost; }
  public void setAverageCost(BigDecimal averageCost) { this.averageCost = averageCost; }
}
