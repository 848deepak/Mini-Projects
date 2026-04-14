package com.cabfleet.service;

import com.cabfleet.entity.*;
import com.cabfleet.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DispatchService {

    private final DriverRepository driverRepository;
    private final DriverPresenceRepository driverPresenceRepository;
    private final DispatchAssignmentRepository assignmentRepository;
    private final RideRequestRepository rideRequestRepository;
    private final TripRepository tripRepository;
    private final TripEventRepository tripEventRepository;

    private static final int ASSIGNMENT_OFFER_TTL_SECONDS = 30;
    private static final double SEARCH_RADIUS_KM = 5.0;
    private static final double COMMISSION_RATE = 0.20;

    /**
     * Core matching engine. Finds the nearest IDLE driver and makes them an offer.
     */
    @Transactional
    public Optional<DispatchAssignment> dispatch(RideRequest request) {
        List<DriverPresence> idleDrivers = driverPresenceRepository.findByStatus(Driver.DriverStatus.IDLE);

        if (idleDrivers.isEmpty()) {
            log.warn("No idle drivers available for request {}", request.getRequestId());
            return Optional.empty();
        }

        // Find nearest driver within radius
        Optional<DriverPresence> nearest = idleDrivers.stream()
                .filter(p -> haversineKm(request.getPickupLat(), request.getPickupLon(), p.getLat(), p.getLon()) <= SEARCH_RADIUS_KM)
                .min(Comparator.comparingDouble(p ->
                        haversineKm(request.getPickupLat(), request.getPickupLon(), p.getLat(), p.getLon())));

        if (nearest.isEmpty()) {
            log.warn("No driver within {}km for request {}", SEARCH_RADIUS_KM, request.getRequestId());
            return Optional.empty();
        }

        DriverPresence driverPresence = nearest.get();
        String driverId = driverPresence.getDriverId();

        // Mark driver as ASSIGNED
        driverRepository.findById(driverId).ifPresent(d -> {
            d.setCurrentStatus(Driver.DriverStatus.ASSIGNED);
            driverRepository.save(d);
        });
        driverPresence.setStatus(Driver.DriverStatus.ASSIGNED);
        driverPresenceRepository.save(driverPresence);

        // Create assignment offer
        DispatchAssignment assignment = DispatchAssignment.builder()
                .requestId(request.getRequestId())
                .driverId(driverId)
                .offeredAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(ASSIGNMENT_OFFER_TTL_SECONDS))
                .state(DispatchAssignment.AssignmentState.OFFERED)
                .build();
        assignmentRepository.save(assignment);

        // Update request status
        request.setStatus(RideRequest.RequestStatus.DISPATCHING);
        request.setUpdatedAt(Instant.now());
        rideRequestRepository.save(request);

        log.info("Offered assignment {} to driver {} for request {}", assignment.getAssignmentId(), driverId, request.getRequestId());
        return Optional.of(assignment);
    }

    @Transactional
    public Trip acceptAssignment(String driverId, String assignmentId) {
        DispatchAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));

        if (!assignment.getDriverId().equals(driverId)) {
            throw new IllegalStateException("Assignment does not belong to driver");
        }
        if (assignment.getState() != DispatchAssignment.AssignmentState.OFFERED) {
            throw new IllegalStateException("Assignment not in OFFERED state: " + assignment.getState());
        }
        if (Instant.now().isAfter(assignment.getExpiresAt())) {
            assignment.setState(DispatchAssignment.AssignmentState.EXPIRED);
            assignmentRepository.save(assignment);
            throw new IllegalStateException("Assignment offer has expired");
        }

        assignment.setState(DispatchAssignment.AssignmentState.ACCEPTED);
        assignmentRepository.save(assignment);

        RideRequest request = rideRequestRepository.findById(assignment.getRequestId())
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        request.setStatus(RideRequest.RequestStatus.ASSIGNED);
        request.setUpdatedAt(Instant.now());
        rideRequestRepository.save(request);

        // Get driver's vehicle
        String vehicleId = driverRepository.findById(driverId)
                .map(d -> d.getDriverId()).orElse("unknown");

        Trip trip = Trip.builder()
                .requestId(request.getRequestId())
                .riderId(request.getRiderId())
                .driverId(driverId)
                .vehicleId(vehicleId)
                .state(Trip.TripState.ASSIGNED)
                .pickupLat(request.getPickupLat())
                .pickupLon(request.getPickupLon())
                .dropLat(request.getDropLat())
                .dropLon(request.getDropLon())
                .assignedAt(Instant.now())
                .build();
        tripRepository.save(trip);

        recordTripEvent(trip.getTripId(), "ASSIGNED", "{\"driverId\":\"" + driverId + "\"}");
        log.info("Trip {} created for driver {}", trip.getTripId(), driverId);
        return trip;
    }

    @Transactional
    public void rejectAssignment(String driverId, String assignmentId) {
        DispatchAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found"));

        if (!assignment.getDriverId().equals(driverId)) {
            throw new IllegalStateException("Assignment does not belong to driver");
        }

        assignment.setState(DispatchAssignment.AssignmentState.REJECTED);
        assignmentRepository.save(assignment);

        // Reset driver to IDLE
        driverRepository.findById(driverId).ifPresent(d -> {
            d.setCurrentStatus(Driver.DriverStatus.IDLE);
            driverRepository.save(d);
        });
        driverPresenceRepository.findById(driverId).ifPresent(p -> {
            p.setStatus(Driver.DriverStatus.IDLE);
            driverPresenceRepository.save(p);
        });

        // Re-dispatch
        RideRequest request = rideRequestRepository.findById(assignment.getRequestId())
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        request.setStatus(RideRequest.RequestStatus.SEARCHING);
        request.setUpdatedAt(Instant.now());
        rideRequestRepository.save(request);
        dispatch(request);
    }

    /** Expire stale offers every 15 seconds */
    @Scheduled(fixedDelay = 15000)
    @Transactional
    public void expireStaleOffers() {
        List<DispatchAssignment> offered = assignmentRepository.findAll().stream()
                .filter(a -> a.getState() == DispatchAssignment.AssignmentState.OFFERED
                        && Instant.now().isAfter(a.getExpiresAt()))
                .collect(Collectors.toList());

        for (DispatchAssignment a : offered) {
            a.setState(DispatchAssignment.AssignmentState.EXPIRED);
            assignmentRepository.save(a);

            driverRepository.findById(a.getDriverId()).ifPresent(d -> {
                d.setCurrentStatus(Driver.DriverStatus.IDLE);
                driverRepository.save(d);
            });
            driverPresenceRepository.findById(a.getDriverId()).ifPresent(p -> {
                p.setStatus(Driver.DriverStatus.IDLE);
                driverPresenceRepository.save(p);
            });

            rideRequestRepository.findById(a.getRequestId()).ifPresent(req -> {
                req.setStatus(RideRequest.RequestStatus.SEARCHING);
                rideRequestRepository.save(req);
                dispatch(req);
            });
        }
        if (!offered.isEmpty()) log.info("Expired {} stale assignment offers", offered.size());
    }

    private void recordTripEvent(String tripId, String eventType, String payload) {
        TripEvent event = TripEvent.builder()
                .tripId(tripId)
                .eventType(eventType)
                .occurredAt(Instant.now())
                .payload(payload)
                .build();
        tripEventRepository.save(event);
    }

    /**
     * Haversine formula — returns distance in km between two lat/lon points.
     */
    public static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    public Optional<DispatchAssignment> getActiveAssignmentForRequest(String requestId) {
        return assignmentRepository.findByRequestIdAndState(requestId, DispatchAssignment.AssignmentState.OFFERED)
                .or(() -> assignmentRepository.findByRequestIdAndState(requestId, DispatchAssignment.AssignmentState.ACCEPTED));
    }
}
