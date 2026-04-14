package com.ecommerce.oms.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Order {

    private final String orderId;
    private final String orderNo;
    private final String customerId;
    private final List<OrderItem> items;
    private final String currency;
    private final Instant createdAt;

    private OrderStatus status;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal shippingFee;
    private BigDecimal discount;
    private BigDecimal total;
    private Instant updatedAt;

    private final List<OrderStatusChange> statusHistory;
    private final List<Shipment> shipments;

    public Order(
            String orderId,
            String orderNo,
            String customerId,
            List<OrderItem> items,
            String currency,
            BigDecimal subtotal,
            BigDecimal tax,
            BigDecimal shippingFee,
            BigDecimal discount,
            BigDecimal total
    ) {
        this.orderId = orderId;
        this.orderNo = orderNo;
        this.customerId = customerId;
        this.items = new ArrayList<>(items);
        this.currency = currency;
        this.subtotal = subtotal;
        this.tax = tax;
        this.shippingFee = shippingFee;
        this.discount = discount;
        this.total = total;
        this.createdAt = Instant.now();
        this.updatedAt = createdAt;
        this.status = OrderStatus.CREATED;
        this.statusHistory = new ArrayList<>();
        this.statusHistory.add(new OrderStatusChange(null, OrderStatus.CREATED, "order initialized"));
        this.shipments = new ArrayList<>();
    }

    public synchronized void transitionTo(OrderStatus newStatus, String reason) {
        if (!OrderStatus.canTransition(this.status, newStatus)) {
            throw new IllegalStateException("Invalid order transition from " + this.status + " to " + newStatus);
        }
        OrderStatus previous = this.status;
        this.status = newStatus;
        this.updatedAt = Instant.now();
        this.statusHistory.add(new OrderStatusChange(previous, newStatus, reason));
    }

    public synchronized void addShipment(Shipment shipment) {
        this.shipments.add(shipment);
        if (status == OrderStatus.PAID) {
            transitionTo(OrderStatus.PACKING, "warehouse accepted shipment request");
        }
        if (status == OrderStatus.PACKING) {
            transitionTo(OrderStatus.SHIPPED, "shipment created");
        }
    }

    public String getOrderId() {
        return orderId;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public String getCustomerId() {
        return customerId;
    }

    public List<OrderItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public String getCurrency() {
        return currency;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public List<OrderStatusChange> getStatusHistory() {
        return Collections.unmodifiableList(statusHistory);
    }

    public List<Shipment> getShipments() {
        return Collections.unmodifiableList(shipments);
    }
}
