package com.miniprojects.billing.model;

import java.math.BigDecimal;
import java.time.Instant;

public class Payment {

  private final String id;
  private final String invoiceId;
  private final BigDecimal amount;
  private final String provider;
  private final String providerRef;
  private final Instant paidAt;

  public Payment(String id, String invoiceId, BigDecimal amount, String provider, String providerRef, Instant paidAt) {
    this.id = id;
    this.invoiceId = invoiceId;
    this.amount = amount;
    this.provider = provider;
    this.providerRef = providerRef;
    this.paidAt = paidAt;
  }

  public String getId() {
    return id;
  }

  public String getInvoiceId() {
    return invoiceId;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public String getProvider() {
    return provider;
  }

  public String getProviderRef() {
    return providerRef;
  }

  public Instant getPaidAt() {
    return paidAt;
  }
}
