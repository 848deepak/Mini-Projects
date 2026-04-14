package com.eventbooking.web.dto;

import jakarta.validation.constraints.NotBlank;

public final class CheckinDtos {

    private CheckinDtos() {
    }

    public record ValidateCheckinRequest(
            @NotBlank String qrToken,
            @NotBlank String gateId,
            @NotBlank String deviceId,
            @NotBlank String idempotencyKey
    ) {
    }
}
