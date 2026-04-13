package com.miniprojects.billing.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateSubscriptionRequest(
  @NotBlank String customerId,
  @NotBlank String planId
) {
}
