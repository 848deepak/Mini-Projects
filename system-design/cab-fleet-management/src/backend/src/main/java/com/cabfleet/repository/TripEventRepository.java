package com.cabfleet.repository;

import com.cabfleet.entity.TripEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripEventRepository extends JpaRepository<TripEvent, String> {
    List<TripEvent> findByTripIdOrderByOccurredAt(String tripId);
}
