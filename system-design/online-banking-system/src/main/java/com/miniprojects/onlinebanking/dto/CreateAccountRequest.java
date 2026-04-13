package com.miniprojects.onlinebanking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record CreateAccountRequest(
  @NotBlank String ownerName,
  @PositiveOrZero BigDecimal openingBalance,
  @NotBlank String currency
) {
}
