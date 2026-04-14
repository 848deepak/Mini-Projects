package com.miniprojects.courier.api;

import com.miniprojects.courier.api.dto.TrackEventRequest;
import com.miniprojects.courier.api.dto.TrackEventResponse;
import com.miniprojects.courier.api.dto.TrackShipmentResponse;
import com.miniprojects.courier.service.TrackingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @PostMapping("/tracking/events")
    public TrackEventResponse ingest(@Valid @RequestBody TrackEventRequest request) {
        return trackingService.ingestEvent(request);
    }

    @GetMapping("/track/{trackingNo}")
    public TrackShipmentResponse track(@PathVariable String trackingNo) {
        return trackingService.getTracking(trackingNo);
    }
}
