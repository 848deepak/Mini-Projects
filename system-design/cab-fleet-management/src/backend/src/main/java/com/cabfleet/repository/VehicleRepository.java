package com.cabfleet.repository;

import com.cabfleet.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    Optional<Vehicle> findByDriverId(String driverId);
    List<Vehicle> findByType(Vehicle.VehicleType type);
    Optional<Vehicle> findByPlateNo(String plateNo);
}
