package com.digitalwallet.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record P2PTransferRequest(
        @NotNull UUID fromWalletId,
        @NotNull UUID toWalletId,
        @NotNull @DecimalMin("0.0001") BigDecimal amount,
        @NotBlank String currency,
        String note,
        @NotBlank String idempotencyKey
) {
}
