package com.cabfleet.repository;

import com.cabfleet.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, String> {
    Optional<Driver> findByPhone(String phone);
    Optional<Driver> findByEmail(String email);
    List<Driver> findByCityIdAndCurrentStatus(String cityId, Driver.DriverStatus status);
    List<Driver> findByCityId(String cityId);
}
