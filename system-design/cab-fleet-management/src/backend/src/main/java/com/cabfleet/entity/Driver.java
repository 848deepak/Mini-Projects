package com.cabfleet.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String driverId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = false)
    private String cityId;

    @Column(nullable = false)
    private Double rating;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverStatus currentStatus;

    private String email;
    private String password;

    @Column(nullable = false)
    private Instant createdAt;

    public enum VerificationStatus {
        PENDING, VERIFIED, REJECTED
    }

    public enum DriverStatus {
        OFFLINE, IDLE, ASSIGNED, ON_TRIP, BREAK
    }
}
