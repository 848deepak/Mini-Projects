package com.miniprojects.courier.api.dto;

import com.miniprojects.courier.model.ShipmentState;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record TrackEventRequest(
    @NotBlank String trackingNo,
    @NotNull ShipmentState eventType,
    @NotNull Instant occurredAt,
    @NotBlank String location,
    @NotBlank String sourceId,
    String payload,
    @NotBlank String idempotencyKey
) {
}
