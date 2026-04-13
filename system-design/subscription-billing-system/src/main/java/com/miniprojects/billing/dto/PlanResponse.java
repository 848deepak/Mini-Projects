package com.miniprojects.billing.dto;

import java.math.BigDecimal;

public record PlanResponse(
  String id,
  String name,
  String billingCycle,
  BigDecimal price,
  String currency,
  String description
) {
}
