package com.ecommerce.oms.api.dto;

import jakarta.validation.constraints.NotBlank;

public record CancelOrderRequest(
        @NotBlank String reason,
        @NotBlank String idempotencyKey
) {
}