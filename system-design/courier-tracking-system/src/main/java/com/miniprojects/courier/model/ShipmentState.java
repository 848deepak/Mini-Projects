package com.miniprojects.courier.model;

public enum ShipmentState {
    CREATED,
    PICKUP_SCHEDULED,
    PICKED_UP,
    IN_TRANSIT,
    AT_HUB,
    OUT_FOR_DELIVERY,
    DELIVERED,
    DELIVERY_FAILED,
    RETURN_INITIATED,
    RETURNED
}
