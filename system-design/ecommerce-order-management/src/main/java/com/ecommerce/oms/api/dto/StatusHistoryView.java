package com.ecommerce.oms.api.dto;

import com.ecommerce.oms.domain.OrderStatus;

import java.time.Instant;

public record StatusHistoryView(
        OrderStatus from,
        OrderStatus to,
        String reason,
        Instant changedAt
) {
}
