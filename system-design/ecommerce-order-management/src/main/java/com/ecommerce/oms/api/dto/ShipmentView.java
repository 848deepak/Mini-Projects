package com.ecommerce.oms.api.dto;

import java.time.Instant;

public record ShipmentView(
        String shipmentId,
        String carrier,
        String trackingNo,
        Instant createdAt
) {
}
