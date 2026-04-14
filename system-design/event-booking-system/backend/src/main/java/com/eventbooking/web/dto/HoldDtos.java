package com.eventbooking.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public final class HoldDtos {

    private HoldDtos() {
    }

    public record CreateHoldRequest(
            @NotBlank String eventId,
            @NotBlank String tierId,
            @Min(1) int quantity,
            @NotBlank String userId,
            @NotBlank String idempotencyKey
    ) {
    }
}
