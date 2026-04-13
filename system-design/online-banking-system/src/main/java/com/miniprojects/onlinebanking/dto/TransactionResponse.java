package com.miniprojects.onlinebanking.dto;

import com.miniprojects.onlinebanking.model.BankTransaction;

import java.math.BigDecimal;
import java.time.Instant;

public record TransactionResponse(
  String id,
  BankTransaction.Type type,
  BigDecimal amount,
  String fromAccountId,
  String toAccountId,
  String note,
  Instant timestamp
) {
}
