package com.miniprojects.onlinebanking.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record TransferResponse(
  String transferId,
  String fromAccountId,
  String toAccountId,
  BigDecimal amount,
  String status,
  Instant timestamp
) {
}
