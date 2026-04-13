package com.miniprojects.billing.model;

import java.math.BigDecimal;

public class Plan {

  private final String id;
  private final String name;
  private final String billingCycle;
  private final BigDecimal price;
  private final String currency;
  private final String description;

  public Plan(String id, String name, String billingCycle, BigDecimal price, String currency, String description) {
    this.id = id;
    this.name = name;
    this.billingCycle = billingCycle;
    this.price = price;
    this.currency = currency;
    this.description = description;
  }

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getBillingCycle() {
    return billingCycle;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public String getCurrency() {
    return currency;
  }

  public String getDescription() {
    return description;
  }
}
