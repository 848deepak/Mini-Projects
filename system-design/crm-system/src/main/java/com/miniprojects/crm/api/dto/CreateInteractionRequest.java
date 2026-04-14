package com.miniprojects.crm.api.dto;

import com.miniprojects.crm.model.EntityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record CreateInteractionRequest(
    @NotNull EntityType entityType,
    @NotBlank String entityId,
    @NotBlank String channel,
    @NotBlank String subject,
    String notes,
    @NotNull Instant occurredAt
) {}
