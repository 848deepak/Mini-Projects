package com.miniprojects.billing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record CreatePlanRequest(
  @NotBlank String name,
  @NotBlank String billingCycle,
  @Positive BigDecimal price,
  @NotBlank String currency,
  @NotBlank String description
) {
}
