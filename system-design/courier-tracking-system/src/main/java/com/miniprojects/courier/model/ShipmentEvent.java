package com.miniprojects.courier.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "shipment_events", indexes = {
    @Index(name = "idx_tracking_occurred", columnList = "trackingNo,occurredAt"),
    @Index(name = "idx_event_idempotency", columnList = "idempotencyKey", unique = true)
})
public class ShipmentEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String eventId;

    @Column(nullable = false)
    private String trackingNo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentState eventType;

    @Column(nullable = false)
    private Instant occurredAt;

    @Column(nullable = false)
    private Instant ingestedAt;

    @Column(nullable = false)
    private String sourceId;

    @Column(nullable = false)
    private String location;

    @Column(length = 2000)
    private String payload;

    @Column(nullable = false, unique = true)
    private String idempotencyKey;

    public ShipmentEvent() {
    }

    @PrePersist
    public void onCreate() {
        if (eventId == null || eventId.isBlank()) {
            eventId = UUID.randomUUID().toString();
        }
        if (ingestedAt == null) {
            ingestedAt = Instant.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getTrackingNo() {
        return trackingNo;
    }

    public void setTrackingNo(String trackingNo) {
        this.trackingNo = trackingNo;
    }

    public ShipmentState getEventType() {
        return eventType;
    }

    public void setEventType(ShipmentState eventType) {
        this.eventType = eventType;
    }

    public Instant getOccurredAt() {
        return occurredAt;
    }

    public void setOccurredAt(Instant occurredAt) {
        this.occurredAt = occurredAt;
    }

    public Instant getIngestedAt() {
        return ingestedAt;
    }

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }
}
