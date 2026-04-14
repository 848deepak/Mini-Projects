package com.ecommerce.oms.api.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record ReturnResponse(
        String returnId,
        String orderId,
        String reason,
        BigDecimal refundAmount,
        boolean refunded,
        Instant createdAt
) {
}
