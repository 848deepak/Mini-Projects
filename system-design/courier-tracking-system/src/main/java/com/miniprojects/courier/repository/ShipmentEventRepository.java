package com.miniprojects.courier.repository;

import com.miniprojects.courier.model.ShipmentEvent;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentEventRepository extends JpaRepository<ShipmentEvent, Long> {
    List<ShipmentEvent> findByTrackingNoOrderByOccurredAtAsc(String trackingNo);
    Optional<ShipmentEvent> findByIdempotencyKey(String idempotencyKey);
}
