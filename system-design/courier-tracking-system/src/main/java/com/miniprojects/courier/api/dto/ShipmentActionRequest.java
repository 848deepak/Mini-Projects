package com.miniprojects.courier.api.dto;

import com.miniprojects.courier.model.ActionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ShipmentActionRequest(
    @NotNull ActionType actionType,
    @NotBlank String reason,
    @NotBlank String actorId,
    @NotBlank String idempotencyKey
) {
}
