package com.miniprojects.courier.api.dto;

import jakarta.validation.constraints.NotBlank;

public record DeliverShipmentRequest(
    @NotBlank String otp,
    @NotBlank String recipientName,
    String signatureUri,
    String photoUri,
    @NotBlank String idempotencyKey
) {
}
