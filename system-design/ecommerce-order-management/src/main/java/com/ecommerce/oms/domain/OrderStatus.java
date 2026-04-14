package com.ecommerce.oms.domain;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public enum OrderStatus {
    CREATED,
    PAYMENT_PENDING,
    PAID,
    PACKING,
    SHIPPED,
    DELIVERED,
    CANCELED,
    RETURN_REQUESTED,
    RETURNED,
    REFUNDED;

    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_TRANSITIONS = new EnumMap<>(OrderStatus.class);

    static {
        ALLOWED_TRANSITIONS.put(CREATED, EnumSet.of(PAYMENT_PENDING, CANCELED));
        ALLOWED_TRANSITIONS.put(PAYMENT_PENDING, EnumSet.of(PAID, CANCELED));
        ALLOWED_TRANSITIONS.put(PAID, EnumSet.of(PACKING, CANCELED));
        ALLOWED_TRANSITIONS.put(PACKING, EnumSet.of(SHIPPED, CANCELED));
        ALLOWED_TRANSITIONS.put(SHIPPED, EnumSet.of(DELIVERED));
        ALLOWED_TRANSITIONS.put(DELIVERED, EnumSet.of(RETURN_REQUESTED));
        ALLOWED_TRANSITIONS.put(RETURN_REQUESTED, EnumSet.of(RETURNED));
        ALLOWED_TRANSITIONS.put(RETURNED, EnumSet.of(REFUNDED));
        ALLOWED_TRANSITIONS.put(CANCELED, EnumSet.noneOf(OrderStatus.class));
        ALLOWED_TRANSITIONS.put(REFUNDED, EnumSet.noneOf(OrderStatus.class));
    }

    public static boolean canTransition(OrderStatus from, OrderStatus to) {
        return ALLOWED_TRANSITIONS.getOrDefault(from, EnumSet.noneOf(OrderStatus.class)).contains(to);
    }
}
