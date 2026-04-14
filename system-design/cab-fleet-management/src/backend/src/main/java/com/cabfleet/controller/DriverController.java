package com.cabfleet.controller;

import com.cabfleet.entity.*;
import com.cabfleet.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/v1/drivers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DriverController {

    private final DriverService driverService;
    private final PayoutService payoutService;
    private final DispatchService dispatchService;

    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @PostMapping
    public ResponseEntity<Driver> registerDriver(@RequestBody Driver driver) {
        return ResponseEntity.ok(driverService.registerDriver(driver));
    }

    @GetMapping("/{driverId}")
    public ResponseEntity<Driver> getDriver(@PathVariable String driverId) {
        return ResponseEntity.ok(driverService.getDriver(driverId));
    }

    @PostMapping("/{driverId}/shift/start")
    public ResponseEntity<Map<String, Object>> startShift(
            @PathVariable String driverId,
            @RequestBody Map<String, Object> body) {
        double lat = ((Number) body.get("lat")).doubleValue();
        double lon = ((Number) body.get("lon")).doubleValue();
        String vehicleId  = (String) body.getOrDefault("vehicleId", "default");
        DriverShift shift = driverService.startShift(driverId, lat, lon, vehicleId);
        return ResponseEntity.ok(Map.of(
            "shiftId", shift.getShiftId(),
            "status",  "IDLE",
            "startAt", shift.getStartAt().toString()
        ));
    }

    @PostMapping("/{driverId}/shift/end")
    public ResponseEntity<Map<String, Object>> endShift(@PathVariable String driverId) {
        DriverShift shift = driverService.endShift(driverId);
        return ResponseEntity.ok(Map.of(
            "shiftId", shift.getShiftId(),
            "status",  "OFFLINE",
            "endAt",   shift.getEndAt().toString()
        ));
    }

    @PostMapping("/{driverId}/presence")
    public ResponseEntity<DriverPresence> updatePresence(
            @PathVariable String driverId,
            @RequestBody Map<String, Object> body) {
        double lat     = ((Number) body.get("lat")).doubleValue();
        double lon     = ((Number) body.get("lon")).doubleValue();
        Double heading = body.containsKey("heading") ? ((Number) body.get("heading")).doubleValue() : null;
        Double speed   = body.containsKey("speed")   ? ((Number) body.get("speed")).doubleValue()   : null;
        return ResponseEntity.ok(driverService.updatePresence(driverId, lat, lon, heading, speed));
    }

    @PostMapping("/{driverId}/assignments/{assignmentId}/accept")
    public ResponseEntity<Trip> acceptAssignment(
            @PathVariable String driverId,
            @PathVariable String assignmentId) {
        return ResponseEntity.ok(dispatchService.acceptAssignment(driverId, assignmentId));
    }

    @PostMapping("/{driverId}/assignments/{assignmentId}/reject")
    public ResponseEntity<Map<String, String>> rejectAssignment(
            @PathVariable String driverId,
            @PathVariable String assignmentId) {
        dispatchService.rejectAssignment(driverId, assignmentId);
        return ResponseEntity.ok(Map.of("status", "REJECTED"));
    }

    @GetMapping("/{driverId}/payouts")
    public ResponseEntity<List<Payout>> getPayouts(@PathVariable String driverId) {
        return ResponseEntity.ok(payoutService.getPayoutsForDriver(driverId));
    }

    @PostMapping("/{driverId}/payouts/compute")
    public ResponseEntity<Payout> computePayout(@PathVariable String driverId) {
        return ResponseEntity.ok(payoutService.computePayout(driverId));
    }
}
