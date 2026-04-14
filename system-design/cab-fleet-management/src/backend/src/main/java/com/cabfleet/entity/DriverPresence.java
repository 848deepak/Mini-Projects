package com.cabfleet.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "driver_presence")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverPresence {

    @Id
    private String driverId;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lon;

    private Double heading;
    private Double speed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Driver.DriverStatus status;

    private Instant lastSeenAt;
}
