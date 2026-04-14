package com.miniprojects.courier.api.dto;

import com.miniprojects.courier.model.ShipmentState;

public record CreateShipmentResponse(
    String shipmentId,
    String trackingNo,
    ShipmentState initialState
) {
}
