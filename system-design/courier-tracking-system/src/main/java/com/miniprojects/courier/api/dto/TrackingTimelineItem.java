package com.miniprojects.courier.api.dto;

import com.miniprojects.courier.model.ShipmentState;
import java.time.Instant;

public record TrackingTimelineItem(
    String eventId,
    ShipmentState eventType,
    Instant occurredAt,
    String location,
    String sourceId,
    String payload
) {
}
