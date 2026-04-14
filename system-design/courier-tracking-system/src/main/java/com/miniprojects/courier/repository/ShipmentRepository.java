package com.miniprojects.courier.repository;

import com.miniprojects.courier.model.Shipment;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository extends JpaRepository<Shipment, String> {
    Optional<Shipment> findByTrackingNo(String trackingNo);
}
