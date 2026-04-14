package com.cabfleet.repository;

import com.cabfleet.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, String> {
    Optional<Trip> findByDriverIdAndStateNotIn(String driverId, List<Trip.TripState> states);
    List<Trip> findByDriverIdOrderByAssignedAtDesc(String driverId);
    List<Trip> findByStateIn(List<Trip.TripState> states);
    List<Trip> findByRiderIdOrderByAssignedAtDesc(String riderId);
}
