package com.ecommerce.oms.domain;

import java.time.Instant;
import java.util.UUID;

public class Shipment {

    private final String shipmentId;
    private final String carrier;
    private final String trackingNo;
    private final Instant createdAt;

    public Shipment(String carrier, String trackingNo) {
        this.shipmentId = UUID.randomUUID().toString();
        this.carrier = carrier;
        this.trackingNo = trackingNo;
        this.createdAt = Instant.now();
    }

    public String getShipmentId() {
        return shipmentId;
    }

    public String getCarrier() {
        return carrier;
    }

    public String getTrackingNo() {
        return trackingNo;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
