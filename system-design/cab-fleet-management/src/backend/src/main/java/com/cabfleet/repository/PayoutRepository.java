package com.cabfleet.repository;

import com.cabfleet.entity.Payout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PayoutRepository extends JpaRepository<Payout, String> {
    List<Payout> findByDriverIdOrderByCreatedAtDesc(String driverId);
    List<Payout> findByStatus(Payout.PayoutStatus status);
}
