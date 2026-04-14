package com.cabfleet.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "driver_shifts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverShift {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String shiftId;

    @Column(nullable = false)
    private String driverId;

    @Column(nullable = false)
    private String vehicleId;

    private Instant startAt;
    private Instant endAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShiftState state;

    public enum ShiftState {
        ACTIVE, ENDED, BREAK
    }
}
