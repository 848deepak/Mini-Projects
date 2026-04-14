package com.cabfleet.service;

import com.cabfleet.entity.*;
import com.cabfleet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayoutService {

    private final PayoutRepository payoutRepository;
    private final TripRepository tripRepository;
    private final FareRepository fareRepository;

    private static final double COMMISSION_RATE = 0.20;

    @Transactional
    public Payout computePayout(String driverId) {
        Instant periodStart = Instant.now().minus(7, ChronoUnit.DAYS);
        Instant periodEnd   = Instant.now();

        List<Trip> completedTrips = tripRepository.findByDriverIdOrderByAssignedAtDesc(driverId).stream()
                .filter(t -> t.getState() == Trip.TripState.COMPLETED
                          && t.getEndedAt() != null
                          && t.getEndedAt().isAfter(periodStart))
                .toList();

        double gross = completedTrips.stream()
                .mapToDouble(t -> {
                    Fare fare = fareRepository.findById(t.getTripId()).orElse(null);
                    return fare != null ? fare.getTotalAmount() : 0.0;
                })
                .sum();

        double commission = Math.round(gross * COMMISSION_RATE * 100) / 100.0;
        double net        = Math.round((gross - commission) * 100) / 100.0;

        Payout payout = Payout.builder()
                .driverId(driverId)
                .periodStart(periodStart)
                .periodEnd(periodEnd)
                .grossAmount(gross)
                .commissionAmount(commission)
                .netAmount(net)
                .tripCount(completedTrips.size())
                .status(Payout.PayoutStatus.PENDING)
                .createdAt(Instant.now())
                .build();

        return payoutRepository.save(payout);
    }

    public List<Payout> getPayoutsForDriver(String driverId) {
        return payoutRepository.findByDriverIdOrderByCreatedAtDesc(driverId);
    }
}
