package com.miniprojects.onlinebanking.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record AccountResponse(
  String id,
  String ownerName,
  String accountNumber,
  String currency,
  BigDecimal balance,
  Instant createdAt
) {
}
