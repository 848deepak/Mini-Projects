package com.eventbooking.web.dto;

import jakarta.validation.constraints.NotBlank;

public final class BookingDtos {

    private BookingDtos() {
    }

    public record CreateBookingRequest(
            @NotBlank String holdId,
            @NotBlank String userId,
            @NotBlank String paymentMethod,
            @NotBlank String idempotencyKey
    ) {
    }
}
