package com.ecommerce.oms.api.dto;

import jakarta.validation.constraints.NotBlank;

public record PaymentUpdateRequest(
        @NotBlank String paymentStatus,
        @NotBlank String providerRef,
        @NotBlank String idempotencyKey
) {
}