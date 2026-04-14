package com.eventbooking.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public final class WaitlistDtos {

    private WaitlistDtos() {
    }

    public record AddWaitlistRequest(
            @NotBlank String eventId,
            @NotBlank String tierId,
            @Min(1) int quantity,
            @NotBlank String userId
    ) {
    }
}
