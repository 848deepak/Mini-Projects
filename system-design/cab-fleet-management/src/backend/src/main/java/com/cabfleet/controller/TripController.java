package com.cabfleet.controller;

import com.cabfleet.entity.*;
import com.cabfleet.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/v1/trips")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TripController {

    private final TripService tripService;
    private final FareService fareService;

    @GetMapping
    public ResponseEntity<List<Trip>> getLiveTrips() {
        return ResponseEntity.ok(tripService.getLiveTrips());
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<Trip> getTrip(@PathVariable String tripId) {
        return ResponseEntity.ok(tripService.getTrip(tripId));
    }

    @GetMapping("/{tripId}/events")
    public ResponseEntity<List<TripEvent>> getTripEvents(@PathVariable String tripId) {
        return ResponseEntity.ok(tripService.getTripEvents(tripId));
    }

    @GetMapping("/{tripId}/fare")
    public ResponseEntity<Fare> getFare(@PathVariable String tripId) {
        Fare fare = fareService.getFareForTrip(tripId);
        if (fare == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(fare);
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Trip>> getDriverTrips(@PathVariable String driverId) {
        return ResponseEntity.ok(tripService.getDriverTrips(driverId));
    }

    @PostMapping("/{tripId}/arrived")
    public ResponseEntity<Trip> markArrived(@PathVariable String tripId) {
        return ResponseEntity.ok(tripService.markArrived(tripId));
    }

    @PostMapping("/{tripId}/start")
    public ResponseEntity<Trip> startTrip(@PathVariable String tripId) {
        return ResponseEntity.ok(tripService.startTrip(tripId));
    }

    @PostMapping("/{tripId}/complete")
    public ResponseEntity<Map<String, Object>> completeTrip(
            @PathVariable String tripId,
            @RequestBody Map<String, Object> body) {
        double distKm = body.containsKey("distanceKm")
                ? ((Number) body.get("distanceKm")).doubleValue()
                : 5.0;
        Trip trip = tripService.completeTrip(tripId, distKm);
        Fare fare = fareService.getFareForTrip(tripId);
        return ResponseEntity.ok(Map.of("trip", trip, "fare", fare));
    }

    @PostMapping("/{tripId}/cancel")
    public ResponseEntity<Trip> cancelTrip(
            @PathVariable String tripId,
            @RequestBody Map<String, Object> body) {
        String reason = (String) body.getOrDefault("reason", "Cancelled by user");
        return ResponseEntity.ok(tripService.cancelTrip(tripId, reason));
    }
}
