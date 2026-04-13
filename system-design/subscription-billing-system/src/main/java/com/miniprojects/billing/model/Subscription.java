package com.miniprojects.billing.model;

import java.math.BigDecimal;
import java.time.Instant;

public class Subscription {

  private final String id;
  private final String customerId;
  private final String planId;
  private String status;
  private final Instant createdAt;
  private Instant currentPeriodStart;
  private Instant currentPeriodEnd;
  private BigDecimal recurringAmount;

  public Subscription(String id, String customerId, String planId, String status, Instant createdAt, Instant currentPeriodStart, Instant currentPeriodEnd, BigDecimal recurringAmount) {
    this.id = id;
    this.customerId = customerId;
    this.planId = planId;
    this.status = status;
    this.createdAt = createdAt;
    this.currentPeriodStart = currentPeriodStart;
    this.currentPeriodEnd = currentPeriodEnd;
    this.recurringAmount = recurringAmount;
  }

  public String getId() {
    return id;
  }

  public String getCustomerId() {
    return customerId;
  }

  public String getPlanId() {
    return planId;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getCurrentPeriodStart() {
    return currentPeriodStart;
  }

  public void setCurrentPeriodStart(Instant currentPeriodStart) {
    this.currentPeriodStart = currentPeriodStart;
  }

  public Instant getCurrentPeriodEnd() {
    return currentPeriodEnd;
  }

  public void setCurrentPeriodEnd(Instant currentPeriodEnd) {
    this.currentPeriodEnd = currentPeriodEnd;
  }

  public BigDecimal getRecurringAmount() {
    return recurringAmount;
  }

  public void setRecurringAmount(BigDecimal recurringAmount) {
    this.recurringAmount = recurringAmount;
  }
}
