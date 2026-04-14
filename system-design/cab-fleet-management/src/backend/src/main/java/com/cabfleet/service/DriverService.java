package com.cabfleet.service;

import com.cabfleet.entity.*;
import com.cabfleet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;
    private final DriverShiftRepository driverShiftRepository;
    private final DriverPresenceRepository driverPresenceRepository;
    private final VehicleRepository vehicleRepository;

    @Transactional
    public DriverShift startShift(String driverId, double lat, double lon, String vehicleId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found: " + driverId));

        // End any existing active shift
        driverShiftRepository.findByDriverIdAndState(driverId, DriverShift.ShiftState.ACTIVE).ifPresent(shift -> {
            shift.setState(DriverShift.ShiftState.ENDED);
            shift.setEndAt(Instant.now());
            driverShiftRepository.save(shift);
        });

        DriverShift shift = DriverShift.builder()
                .driverId(driverId)
                .vehicleId(vehicleId)
                .startAt(Instant.now())
                .state(DriverShift.ShiftState.ACTIVE)
                .build();
        driverShiftRepository.save(shift);

        // Update driver status to IDLE
        driver.setCurrentStatus(Driver.DriverStatus.IDLE);
        driverRepository.save(driver);

        // Update presence
        upsertPresence(driverId, lat, lon, null, null, Driver.DriverStatus.IDLE);

        return shift;
    }

    @Transactional
    public DriverShift endShift(String driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found: " + driverId));

        DriverShift shift = driverShiftRepository.findByDriverIdAndState(driverId, DriverShift.ShiftState.ACTIVE)
                .orElseThrow(() -> new IllegalStateException("No active shift for driver: " + driverId));

        shift.setState(DriverShift.ShiftState.ENDED);
        shift.setEndAt(Instant.now());
        driverShiftRepository.save(shift);

        driver.setCurrentStatus(Driver.DriverStatus.OFFLINE);
        driverRepository.save(driver);

        // Remove presence
        driverPresenceRepository.findById(driverId).ifPresent(p -> {
            p.setStatus(Driver.DriverStatus.OFFLINE);
            driverPresenceRepository.save(p);
        });

        return shift;
    }

    @Transactional
    public DriverPresence updatePresence(String driverId, double lat, double lon, Double heading, Double speed) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found: " + driverId));
        return upsertPresence(driverId, lat, lon, heading, speed, driver.getCurrentStatus());
    }

    private DriverPresence upsertPresence(String driverId, double lat, double lon, Double heading, Double speed, Driver.DriverStatus status) {
        DriverPresence presence = driverPresenceRepository.findById(driverId)
                .orElse(DriverPresence.builder().driverId(driverId).build());
        presence.setLat(lat);
        presence.setLon(lon);
        presence.setHeading(heading);
        presence.setSpeed(speed);
        presence.setStatus(status);
        presence.setLastSeenAt(Instant.now());
        return driverPresenceRepository.save(presence);
    }

    public Driver getDriver(String driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found: " + driverId));
    }

    public List<Driver> getActiveDriversByCity(String cityId) {
        return driverRepository.findByCityIdAndCurrentStatus(cityId, Driver.DriverStatus.IDLE);
    }

    public List<Driver> getAllByCity(String cityId) {
        return driverRepository.findByCityId(cityId);
    }

    @Transactional
    public Driver registerDriver(Driver driver) {
        driver.setCreatedAt(Instant.now());
        driver.setCurrentStatus(Driver.DriverStatus.OFFLINE);
        driver.setVerificationStatus(Driver.VerificationStatus.VERIFIED);
        if (driver.getRating() == null) driver.setRating(5.0);
        return driverRepository.save(driver);
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }
}
