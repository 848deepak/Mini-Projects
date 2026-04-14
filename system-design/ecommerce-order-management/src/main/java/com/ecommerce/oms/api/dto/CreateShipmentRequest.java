package com.ecommerce.oms.api.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateShipmentRequest(
        @NotBlank String carrier,
        @NotBlank String trackingNo
) {
}
