package com.ecommerce.oms.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateReturnRequest(
        @NotBlank String orderId,
        @NotBlank String reason,
        @NotNull @DecimalMin("0.01") BigDecimal refundAmount,
        @NotBlank String idempotencyKey
) {
}
