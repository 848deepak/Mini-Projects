package com.cabfleet.controller;

import com.cabfleet.entity.*;
import com.cabfleet.service.OpsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/v1/ops")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OpsController {

    private final OpsService opsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(opsService.getDashboardStats());
    }

    @GetMapping("/zones/supply-demand")
    public ResponseEntity<Map<String, Object>> getSupplyDemand(
            @RequestParam(defaultValue = "BLR") String cityId,
            @RequestParam(defaultValue = "5m") String window) {
        return ResponseEntity.ok(opsService.getSupplyDemand(cityId));
    }

    @GetMapping("/drivers/active")
    public ResponseEntity<List<Driver>> getActiveDrivers(
            @RequestParam(defaultValue = "BLR") String cityId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(opsService.getActiveDrivers(cityId, status));
    }

    @GetMapping("/drivers/locations")
    public ResponseEntity<List<DriverPresence>> getDriverLocations() {
        return ResponseEntity.ok(opsService.getDriverLocations());
    }

    @GetMapping("/trips/live")
    public ResponseEntity<List<Trip>> getLiveTrips(
            @RequestParam(defaultValue = "BLR") String cityId) {
        return ResponseEntity.ok(opsService.getLiveTrips(cityId));
    }
}
