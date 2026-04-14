package com.ecommerce.oms.domain;

import java.time.Instant;

public class OrderStatusChange {

    private final OrderStatus from;
    private final OrderStatus to;
    private final String reason;
    private final Instant changedAt;

    public OrderStatusChange(OrderStatus from, OrderStatus to, String reason) {
        this.from = from;
        this.to = to;
        this.reason = reason;
        this.changedAt = Instant.now();
    }

    public OrderStatus getFrom() {
        return from;
    }

    public OrderStatus getTo() {
        return to;
    }

    public String getReason() {
        return reason;
    }

    public Instant getChangedAt() {
        return changedAt;
    }
}
