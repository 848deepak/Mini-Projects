package com.miniprojects.billing.dto;

import jakarta.validation.constraints.NotBlank;

public record PayInvoiceRequest(
  @NotBlank String provider
) {
}
