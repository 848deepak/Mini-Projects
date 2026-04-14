package com.miniprojects.crm.api.dto;

import com.miniprojects.crm.model.LeadStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record QualifyLeadRequest(
    @NotBlank String qualificationNotes,
    @NotNull LeadStatus decision
) {}
