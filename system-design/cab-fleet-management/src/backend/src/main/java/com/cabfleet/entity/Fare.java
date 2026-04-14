package com.cabfleet.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fares")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fare {

    @Id
    private String tripId;

    private Double baseAmount;
    private Double distanceAmount;
    private Double timeAmount;
    private Double surgeAmount;
    private Double tollAmount;
    private Double totalAmount;
    private Double surgeMultiplier;
    private Double distanceKm;
    private Long durationSeconds;
}
