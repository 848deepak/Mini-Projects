package com.cabfleet.repository;

import com.cabfleet.entity.RideRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RideRequestRepository extends JpaRepository<RideRequest, String> {
    Optional<RideRequest> findByIdempotencyKey(String idempotencyKey);
    List<RideRequest> findByRiderIdOrderByCreatedAtDesc(String riderId);
    List<RideRequest> findByStatus(RideRequest.RequestStatus status);
}
