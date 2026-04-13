package com.miniprojects.billing.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record SubscriptionResponse(
  String id,
  String customerId,
  String planId,
  String status,
  Instant createdAt,
  Instant currentPeriodStart,
  Instant currentPeriodEnd,
  BigDecimal recurringAmount
) {
}
