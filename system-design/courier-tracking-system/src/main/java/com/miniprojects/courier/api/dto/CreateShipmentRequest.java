package com.miniprojects.courier.api.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateShipmentRequest(
    @NotBlank String merchantId,
    @NotBlank String senderName,
    @NotBlank String senderAddress,
    @NotBlank String receiverName,
    @NotBlank String receiverAddress,
    @NotBlank String serviceLevel,
    @NotBlank String idempotencyKey
) {
}
