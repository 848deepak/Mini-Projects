package com.miniprojects.courier.api;

import com.miniprojects.courier.api.dto.CreateShipmentRequest;
import com.miniprojects.courier.api.dto.CreateShipmentResponse;
import com.miniprojects.courier.api.dto.DeliverShipmentRequest;
import com.miniprojects.courier.api.dto.ShipmentActionRequest;
import com.miniprojects.courier.api.dto.TrackEventResponse;
import com.miniprojects.courier.api.dto.TrackingTimelineItem;
import com.miniprojects.courier.service.TrackingService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/shipments")
public class ShipmentController {

    private final TrackingService trackingService;

    public ShipmentController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateShipmentResponse createShipment(@Valid @RequestBody CreateShipmentRequest request) {
        return trackingService.createShipment(request);
    }

    @GetMapping("/{shipmentId}/timeline")
    public List<TrackingTimelineItem> timeline(@PathVariable String shipmentId) {
        return trackingService.getTimeline(shipmentId);
    }

    @PostMapping("/{shipmentId}/actions")
    public TrackEventResponse action(
        @PathVariable String shipmentId,
        @Valid @RequestBody ShipmentActionRequest request
    ) {
        return trackingService.applyAction(shipmentId, request);
    }

    @PostMapping("/{shipmentId}/deliver")
    public TrackEventResponse deliver(
        @PathVariable String shipmentId,
        @Valid @RequestBody DeliverShipmentRequest request
    ) {
        return trackingService.deliverShipment(shipmentId, request);
    }
}
