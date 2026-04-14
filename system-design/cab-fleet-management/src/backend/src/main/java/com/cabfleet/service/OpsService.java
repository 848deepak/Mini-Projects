package com.cabfleet.service;

import com.cabfleet.entity.*;
import com.cabfleet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OpsService {

    private final DriverRepository driverRepository;
    private final DriverPresenceRepository driverPresenceRepository;
    private final TripRepository tripRepository;
    private final RideRequestRepository rideRequestRepository;

    public Map<String, Object> getSupplyDemand(String cityId) {
        List<Driver> allDrivers    = driverRepository.findByCityId(cityId);
        long idle       = allDrivers.stream().filter(d -> d.getCurrentStatus() == Driver.DriverStatus.IDLE).count();
        long onTrip     = allDrivers.stream().filter(d -> d.getCurrentStatus() == Driver.DriverStatus.ON_TRIP).count();
        long assigned   = allDrivers.stream().filter(d -> d.getCurrentStatus() == Driver.DriverStatus.ASSIGNED).count();
        long offline    = allDrivers.stream().filter(d -> d.getCurrentStatus() == Driver.DriverStatus.OFFLINE).count();

        List<RideRequest> searching = rideRequestRepository.findByStatus(RideRequest.RequestStatus.SEARCHING);

        return Map.of(
            "cityId",       cityId,
            "totalDrivers", allDrivers.size(),
            "idle",         idle,
            "onTrip",       onTrip,
            "assigned",     assigned,
            "offline",      offline,
            "pendingRequests", searching.size(),
            "supplyDemandRatio", idle == 0 ? 0.0 : (double) idle / Math.max(1, searching.size()),
            "timestamp",    Instant.now().toString()
        );
    }

    public List<Driver> getActiveDrivers(String cityId, String status) {
        if (status != null && !status.isBlank()) {
            Driver.DriverStatus ds = Driver.DriverStatus.valueOf(status.toUpperCase());
            return driverRepository.findByCityIdAndCurrentStatus(cityId, ds);
        }
        return driverRepository.findByCityId(cityId).stream()
                .filter(d -> d.getCurrentStatus() != Driver.DriverStatus.OFFLINE)
                .toList();
    }

    public List<Trip> getLiveTrips(String cityId) {
        // In production, city would be derived from driver's city; here we return all live trips
        return tripRepository.findByStateIn(List.of(Trip.TripState.ASSIGNED, Trip.TripState.ARRIVED, Trip.TripState.STARTED));
    }

    public List<DriverPresence> getDriverLocations() {
        return driverPresenceRepository.findAll();
    }

    public Map<String, Object> getDashboardStats() {
        long totalDrivers  = driverRepository.count();
        long idleDrivers   = driverPresenceRepository.findByStatus(Driver.DriverStatus.IDLE).size();
        long onTripDrivers = driverPresenceRepository.findByStatus(Driver.DriverStatus.ON_TRIP).size();
        long liveTrips     = tripRepository.findByStateIn(List.of(Trip.TripState.ASSIGNED, Trip.TripState.ARRIVED, Trip.TripState.STARTED)).size();
        long pendingReqs   = rideRequestRepository.findByStatus(RideRequest.RequestStatus.SEARCHING).size();
        long completedToday = tripRepository.findByStateIn(List.of(Trip.TripState.COMPLETED)).size();

        return Map.of(
            "totalDrivers",   totalDrivers,
            "idleDrivers",    idleDrivers,
            "onTripDrivers",  onTripDrivers,
            "liveTrips",      liveTrips,
            "pendingRequests",pendingReqs,
            "completedTrips", completedToday,
            "timestamp",      Instant.now().toString()
        );
    }
}
