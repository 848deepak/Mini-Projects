package com.cabfleet.service;

import com.cabfleet.entity.*;
import com.cabfleet.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripService {

    private final TripRepository tripRepository;
    private final TripEventRepository tripEventRepository;
    private final DriverRepository driverRepository;
    private final DriverPresenceRepository driverPresenceRepository;
    private final RideRequestRepository rideRequestRepository;
    private final FareService fareService;

    @Transactional
    public Trip markArrived(String tripId) {
        Trip trip = getAndValidateTrip(tripId, Trip.TripState.ASSIGNED);
        trip.setState(Trip.TripState.ARRIVED);
        trip.setArrivedAt(Instant.now());
        tripRepository.save(trip);
        recordEvent(tripId, "ARRIVED", "{}");
        log.info("Trip {} ARRIVED", tripId);
        return trip;
    }

    @Transactional
    public Trip startTrip(String tripId) {
        Trip trip = getAndValidateTrip(tripId, Trip.TripState.ARRIVED);
        trip.setState(Trip.TripState.STARTED);
        trip.setStartedAt(Instant.now());
        tripRepository.save(trip);

        // Update driver status to ON_TRIP
        updateDriverStatus(trip.getDriverId(), Driver.DriverStatus.ON_TRIP);
        recordEvent(tripId, "STARTED", "{}");
        log.info("Trip {} STARTED", tripId);
        return trip;
    }

    @Transactional
    public Trip completeTrip(String tripId, double totalDistanceKm) {
        Trip trip = getAndValidateTrip(tripId, Trip.TripState.STARTED);
        Instant now = Instant.now();
        trip.setState(Trip.TripState.COMPLETED);
        trip.setEndedAt(now);
        trip.setTotalDistanceKm(totalDistanceKm);

        long durationSec = trip.getStartedAt() != null
                ? now.getEpochSecond() - trip.getStartedAt().getEpochSecond()
                : 0L;
        trip.setDurationSeconds(durationSec);
        tripRepository.save(trip);

        // Compute and save fare
        fareService.computeAndSaveFare(tripId, totalDistanceKm, durationSec, 1.0);

        // Reset driver to IDLE
        updateDriverStatus(trip.getDriverId(), Driver.DriverStatus.IDLE);

        // Complete the ride request
        rideRequestRepository.findById(trip.getRequestId()).ifPresent(r -> {
            r.setStatus(RideRequest.RequestStatus.COMPLETED);
            r.setUpdatedAt(Instant.now());
            rideRequestRepository.save(r);
        });

        recordEvent(tripId, "COMPLETED", "{\"distanceKm\":" + totalDistanceKm + ",\"durationSec\":" + durationSec + "}");
        log.info("Trip {} COMPLETED — {}km in {}s", tripId, totalDistanceKm, durationSec);
        return trip;
    }

    @Transactional
    public Trip cancelTrip(String tripId, String reason) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found: " + tripId));

        if (trip.getState() == Trip.TripState.COMPLETED || trip.getState() == Trip.TripState.CANCELLED) {
            throw new IllegalStateException("Trip already in terminal state");
        }

        trip.setState(Trip.TripState.CANCELLED);
        trip.setCancelReason(reason);
        trip.setEndedAt(Instant.now());
        tripRepository.save(trip);

        updateDriverStatus(trip.getDriverId(), Driver.DriverStatus.IDLE);
        recordEvent(tripId, "CANCELLED", "{\"reason\":\"" + reason + "\"}");
        return trip;
    }

    public Trip getTrip(String tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found: " + tripId));
    }

    public List<Trip> getLiveTrips() {
        return tripRepository.findByStateIn(List.of(Trip.TripState.ASSIGNED, Trip.TripState.ARRIVED, Trip.TripState.STARTED));
    }

    public List<Trip> getDriverTrips(String driverId) {
        return tripRepository.findByDriverIdOrderByAssignedAtDesc(driverId);
    }

    public List<TripEvent> getTripEvents(String tripId) {
        return tripEventRepository.findByTripIdOrderByOccurredAt(tripId);
    }

    private Trip getAndValidateTrip(String tripId, Trip.TripState expectedState) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found: " + tripId));
        if (trip.getState() != expectedState) {
            throw new IllegalStateException("Expected trip in " + expectedState + " but was " + trip.getState());
        }
        return trip;
    }

    private void updateDriverStatus(String driverId, Driver.DriverStatus status) {
        driverRepository.findById(driverId).ifPresent(d -> {
            d.setCurrentStatus(status);
            driverRepository.save(d);
        });
        driverPresenceRepository.findById(driverId).ifPresent(p -> {
            p.setStatus(status);
            driverPresenceRepository.save(p);
        });
    }

    private void recordEvent(String tripId, String type, String payload) {
        tripEventRepository.save(TripEvent.builder()
                .tripId(tripId)
                .eventType(type)
                .occurredAt(Instant.now())
                .payload(payload)
                .build());
    }
}
