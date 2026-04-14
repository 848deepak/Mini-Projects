package com.miniprojects.crm.api.dto;

import com.miniprojects.crm.model.EntityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record CreateTaskRequest(
    @NotNull EntityType entityType,
    @NotBlank String entityId,
    @NotNull Instant dueAt,
    @NotBlank String priority,
    @NotBlank String assigneeUserId
) {}
