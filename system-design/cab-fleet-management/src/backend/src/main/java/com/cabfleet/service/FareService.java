package com.cabfleet.service;

import com.cabfleet.entity.Fare;
import com.cabfleet.repository.FareRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FareService {

    private final FareRepository fareRepository;

    // Pricing config (INR)
    private static final double BASE_FARE     = 30.0;
    private static final double RATE_PER_KM   = 12.0;
    private static final double RATE_PER_MIN  = 1.5;
    private static final double TOLL_FLAT     = 0.0;

    @Transactional
    public Fare computeAndSaveFare(String tripId, double distanceKm, long durationSeconds, double surgeMultiplier) {
        double distanceAmount = distanceKm * RATE_PER_KM;
        double timeAmount     = (durationSeconds / 60.0) * RATE_PER_MIN;
        double preTotal       = BASE_FARE + distanceAmount + timeAmount + TOLL_FLAT;
        double surgeAmount    = preTotal * (surgeMultiplier - 1.0);
        double total          = preTotal + surgeAmount;

        Fare fare = Fare.builder()
                .tripId(tripId)
                .baseAmount(BASE_FARE)
                .distanceAmount(Math.round(distanceAmount * 100.0) / 100.0)
                .timeAmount(Math.round(timeAmount * 100.0) / 100.0)
                .surgeAmount(Math.round(surgeAmount * 100.0) / 100.0)
                .tollAmount(TOLL_FLAT)
                .totalAmount(Math.round(total * 100.0) / 100.0)
                .surgeMultiplier(surgeMultiplier)
                .distanceKm(distanceKm)
                .durationSeconds(durationSeconds)
                .build();

        return fareRepository.save(fare);
    }

    public Fare getFareForTrip(String tripId) {
        return fareRepository.findById(tripId).orElse(null);
    }

    public double estimateFare(double pickupLat, double pickupLon, double dropLat, double dropLon) {
        double distKm   = DispatchService.haversineKm(pickupLat, pickupLon, dropLat, dropLon);
        double estimated = BASE_FARE + (distKm * RATE_PER_KM) + (10 * RATE_PER_MIN); // 10 min base estimate
        return Math.round(estimated * 100.0) / 100.0;
    }
}
