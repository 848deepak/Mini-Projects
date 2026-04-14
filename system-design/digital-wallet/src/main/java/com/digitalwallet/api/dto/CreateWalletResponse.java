package com.digitalwallet.api.dto;

import com.digitalwallet.domain.enums.KycLevel;
import com.digitalwallet.domain.enums.WalletStatus;

import java.util.UUID;

public record CreateWalletResponse(
        UUID walletId,
        UUID userId,
        WalletStatus status,
        KycLevel kycLevel,
        String currency
) {
}
