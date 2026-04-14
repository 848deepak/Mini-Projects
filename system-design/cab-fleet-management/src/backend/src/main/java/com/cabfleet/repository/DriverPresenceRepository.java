package com.cabfleet.repository;

import com.cabfleet.entity.DriverPresence;
import com.cabfleet.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DriverPresenceRepository extends JpaRepository<DriverPresence, String> {
    List<DriverPresence> findByStatus(Driver.DriverStatus status);
}
