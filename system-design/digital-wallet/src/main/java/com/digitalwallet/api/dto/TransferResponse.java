package com.digitalwallet.api.dto;

import com.digitalwallet.domain.enums.TxnStatus;

import java.util.UUID;

public record TransferResponse(
        UUID txnId,
        TxnStatus status
) {
}
