package com.cabfleet.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "ride_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RideRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String requestId;

    @Column(nullable = false)
    private String riderId;

    @Column(nullable = false)
    private Double pickupLat;

    @Column(nullable = false)
    private Double pickupLon;

    @Column(nullable = false)
    private Double dropLat;

    @Column(nullable = false)
    private Double dropLon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Vehicle.VehicleType requestedVehicleType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    private String paymentMethodId;
    private String idempotencyKey;

    private Instant createdAt;
    private Instant updatedAt;

    public enum RequestStatus {
        SEARCHING, DISPATCHING, ASSIGNED, CANCELLED, COMPLETED
    }
}
