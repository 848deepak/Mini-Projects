package com.cabfleet.repository;

import com.cabfleet.entity.DriverShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DriverShiftRepository extends JpaRepository<DriverShift, String> {
    Optional<DriverShift> findByDriverIdAndState(String driverId, DriverShift.ShiftState state);
}
