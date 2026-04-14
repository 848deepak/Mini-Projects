package com.ecommerce.oms.api.dto;

import com.ecommerce.oms.domain.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        String orderId,
        String orderNo,
        String customerId,
        OrderStatus status,
        String currency,
        BigDecimal subtotal,
        BigDecimal tax,
        BigDecimal shippingFee,
        BigDecimal discount,
        BigDecimal total,
        Instant createdAt,
        Instant updatedAt,
        List<OrderItemView> items,
        List<ShipmentView> shipments,
        List<StatusHistoryView> statusHistory
) {
}
