package com.miniprojects.trading.model;

import java.math.BigDecimal;

public class Portfolio {

  private final String userId;
  private BigDecimal cashBalance;
  private BigDecimal marketValue;
  private BigDecimal pnl;

  public Portfolio(String userId, BigDecimal cashBalance, BigDecimal marketValue, BigDecimal pnl) {
    this.userId = userId;
    this.cashBalance = cashBalance;
    this.marketValue = marketValue;
    this.pnl = pnl;
  }

  public String getUserId() { return userId; }
  public BigDecimal getCashBalance() { return cashBalance; }
  public void setCashBalance(BigDecimal cashBalance) { this.cashBalance = cashBalance; }
  public BigDecimal getMarketValue() { return marketValue; }
  public void setMarketValue(BigDecimal marketValue) { this.marketValue = marketValue; }
  public BigDecimal getPnl() { return pnl; }
  public void setPnl(BigDecimal pnl) { this.pnl = pnl; }
}
