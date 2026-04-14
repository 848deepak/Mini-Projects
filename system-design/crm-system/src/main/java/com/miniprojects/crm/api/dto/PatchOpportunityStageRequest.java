package com.miniprojects.crm.api.dto;

import com.miniprojects.crm.model.OpportunityStage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PatchOpportunityStageRequest(
    @NotNull OpportunityStage fromStage,
    @NotNull OpportunityStage toStage,
    @NotBlank String reason,
    long version,
    @NotBlank String idempotencyKey
) {}
