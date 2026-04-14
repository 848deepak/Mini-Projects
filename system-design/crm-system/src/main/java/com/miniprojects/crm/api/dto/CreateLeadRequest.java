package com.miniprojects.crm.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateLeadRequest(
    @NotBlank String source,
    @NotBlank String fullName,
    @NotBlank @Email String email,
    @NotBlank String phone,
    @NotBlank String ownerUserId,
    @NotBlank String idempotencyKey
) {}
