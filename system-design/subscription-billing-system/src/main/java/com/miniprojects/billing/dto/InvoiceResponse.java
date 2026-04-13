package com.miniprojects.billing.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record InvoiceResponse(
  String id,
  String subscriptionId,
  String customerId,
  BigDecimal amount,
  String currency,
  Instant issuedAt,
  Instant dueAt,
  String status,
  Instant paidAt
) {
}
