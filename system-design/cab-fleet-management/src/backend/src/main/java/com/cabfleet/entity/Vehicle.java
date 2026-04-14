package com.cabfleet.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String vehicleId;

    @Column(nullable = false, unique = true)
    private String driverId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType type;

    @Column(nullable = false, unique = true)
    private String plateNo;

    private Integer capacity;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    private String model;
    private String color;
    private Integer year;

    public enum VehicleType {
        AUTO, MINI, SEDAN, SUV, PREMIUM
    }

    public enum VehicleStatus {
        ACTIVE, INACTIVE, MAINTENANCE
    }
}
