package com.digitalwallet.api.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record WalletBalanceResponse(
        BigDecimal available,
        BigDecimal pending,
        String currency,
        Instant asOf
) {
}
