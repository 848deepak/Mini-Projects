package com.ecommerce.oms.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class ReturnRequestRecord {

    private final String returnId;
    private final String orderId;
    private final String reason;
    private final BigDecimal refundAmount;
    private final Instant createdAt;
    private boolean refunded;

    public ReturnRequestRecord(String orderId, String reason, BigDecimal refundAmount) {
        this.returnId = UUID.randomUUID().toString();
        this.orderId = orderId;
        this.reason = reason;
        this.refundAmount = refundAmount;
        this.createdAt = Instant.now();
        this.refunded = false;
    }

    public String getReturnId() {
        return returnId;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getReason() {
        return reason;
    }

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public boolean isRefunded() {
        return refunded;
    }

    public void markRefunded() {
        this.refunded = true;
    }
}
