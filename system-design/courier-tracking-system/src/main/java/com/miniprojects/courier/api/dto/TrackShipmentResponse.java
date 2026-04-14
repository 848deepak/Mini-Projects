package com.miniprojects.courier.api.dto;

import com.miniprojects.courier.model.ShipmentState;
import java.util.List;

public record TrackShipmentResponse(
    String shipmentId,
    String trackingNo,
    ShipmentState currentState,
    String eta,
    String lastLocation,
    List<TrackingTimelineItem> timeline
) {
}
