package com.miniprojects.crm.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ConvertLeadRequest(
    @NotBlank String accountName,
    @NotBlank String industry,
    @NotBlank String opportunityName,
    @NotNull BigDecimal opportunityAmount,
    int probability,
    @NotNull LocalDate expectedCloseDate,
    @NotBlank String idempotencyKey
) {}
