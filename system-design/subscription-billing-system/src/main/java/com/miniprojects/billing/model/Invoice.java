package com.miniprojects.billing.model;

import java.math.BigDecimal;
import java.time.Instant;

public class Invoice {

  private final String id;
  private final String subscriptionId;
  private final String customerId;
  private final BigDecimal amount;
  private final String currency;
  private final Instant issuedAt;
  private final Instant dueAt;
  private String status;
  private Instant paidAt;

  public Invoice(String id, String subscriptionId, String customerId, BigDecimal amount, String currency, Instant issuedAt, Instant dueAt, String status) {
    this.id = id;
    this.subscriptionId = subscriptionId;
    this.customerId = customerId;
    this.amount = amount;
    this.currency = currency;
    this.issuedAt = issuedAt;
    this.dueAt = dueAt;
    this.status = status;
  }

  public String getId() {
    return id;
  }

  public String getSubscriptionId() {
    return subscriptionId;
  }

  public String getCustomerId() {
    return customerId;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public String getCurrency() {
    return currency;
  }

  public Instant getIssuedAt() {
    return issuedAt;
  }

  public Instant getDueAt() {
    return dueAt;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public Instant getPaidAt() {
    return paidAt;
  }

  public void setPaidAt(Instant paidAt) {
    this.paidAt = paidAt;
  }
}
