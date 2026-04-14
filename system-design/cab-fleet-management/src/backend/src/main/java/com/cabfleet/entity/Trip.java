package com.cabfleet.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "trips")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String tripId;

    @Column(nullable = false)
    private String requestId;

    @Column(nullable = false)
    private String riderId;

    @Column(nullable = false)
    private String driverId;

    @Column(nullable = false)
    private String vehicleId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripState state;

    private Double pickupLat;
    private Double pickupLon;
    private Double dropLat;
    private Double dropLon;

    private Instant assignedAt;
    private Instant arrivedAt;
    private Instant startedAt;
    private Instant endedAt;

    private String cancelReason;
    private Double totalDistanceKm;
    private Long durationSeconds;

    public enum TripState {
        ASSIGNED, ARRIVED, STARTED, COMPLETED, CANCELLED
    }
}
