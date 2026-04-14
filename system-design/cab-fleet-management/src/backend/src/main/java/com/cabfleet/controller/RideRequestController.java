package com.cabfleet.controller;

import com.cabfleet.entity.*;
import com.cabfleet.repository.RideRequestRepository;
import com.cabfleet.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/v1/ride-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RideRequestController {

    private final RideRequestRepository requestRepo;
    private final DispatchService dispatchService;
    private final FareService fareService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRideRequest(@RequestBody Map<String, Object> body) {
        String riderId       = (String) body.get("riderId");
        double pickupLat     = ((Number) body.get("pickupLat")).doubleValue();
        double pickupLon     = ((Number) body.get("pickupLon")).doubleValue();
        double dropLat       = ((Number) body.get("dropLat")).doubleValue();
        double dropLon       = ((Number) body.get("dropLon")).doubleValue();
        String vehicleTypeStr = (String) body.getOrDefault("vehicleType", "MINI");
        String idempotencyKey = (String) body.getOrDefault("idempotencyKey", UUID.randomUUID().toString());

        // Idempotency check
        Optional<RideRequest> existing = requestRepo.findByIdempotencyKey(idempotencyKey);
        if (existing.isPresent()) {
            return buildRideResponse(existing.get());
        }

        Vehicle.VehicleType vType = Vehicle.VehicleType.valueOf(vehicleTypeStr.toUpperCase());
        double fareEstimate = fareService.estimateFare(pickupLat, pickupLon, dropLat, dropLon);
        double distKm       = com.cabfleet.service.DispatchService.haversineKm(pickupLat, pickupLon, dropLat, dropLon);
        long etaSec         = (long) ((distKm / 30.0) * 3600); // assume 30 km/h

        RideRequest request = RideRequest.builder()
                .riderId(riderId)
                .pickupLat(pickupLat)
                .pickupLon(pickupLon)
                .dropLat(dropLat)
                .dropLon(dropLon)
                .requestedVehicleType(vType)
                .status(RideRequest.RequestStatus.SEARCHING)
                .idempotencyKey(idempotencyKey)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        requestRepo.save(request);

        dispatchService.dispatch(request);

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("requestId",     request.getRequestId());
        resp.put("status",        request.getStatus());
        resp.put("etaSec",        etaSec);
        resp.put("fareEstimate",  fareEstimate);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{requestId}/status")
    public ResponseEntity<Map<String, Object>> getStatus(@PathVariable String requestId) {
        RideRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        return buildRideResponse(request);
    }

    @GetMapping("/rider/{riderId}")
    public ResponseEntity<List<RideRequest>> getRiderHistory(@PathVariable String riderId) {
        return ResponseEntity.ok(requestRepo.findByRiderIdOrderByCreatedAtDesc(riderId));
    }

    @GetMapping
    public ResponseEntity<List<RideRequest>> getAllRequests() {
        return ResponseEntity.ok(requestRepo.findAll());
    }

    private ResponseEntity<Map<String, Object>> buildRideResponse(RideRequest req) {
        Optional<DispatchAssignment> assignment = dispatchService.getActiveAssignmentForRequest(req.getRequestId());
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("requestId",    req.getRequestId());
        resp.put("status",       req.getStatus());
        resp.put("assignmentId", assignment.map(DispatchAssignment::getAssignmentId).orElse(null));
        resp.put("driverId",     assignment.map(DispatchAssignment::getDriverId).orElse(null));
        return ResponseEntity.ok(resp);
    }
}
