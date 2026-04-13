package com.miniprojects.onlinebanking.model;

import java.math.BigDecimal;
import java.time.Instant;

public class BankAccount {

  private final String id;
  private final String ownerName;
  private final String accountNumber;
  private final String currency;
  private BigDecimal balance;
  private final Instant createdAt;

  public BankAccount(String id, String ownerName, String accountNumber, String currency, BigDecimal balance, Instant createdAt) {
    this.id = id;
    this.ownerName = ownerName;
    this.accountNumber = accountNumber;
    this.currency = currency;
    this.balance = balance;
    this.createdAt = createdAt;
  }

  public String getId() {
    return id;
  }

  public String getOwnerName() {
    return ownerName;
  }

  public String getAccountNumber() {
    return accountNumber;
  }

  public String getCurrency() {
    return currency;
  }

  public BigDecimal getBalance() {
    return balance;
  }

  public void setBalance(BigDecimal balance) {
    this.balance = balance;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
