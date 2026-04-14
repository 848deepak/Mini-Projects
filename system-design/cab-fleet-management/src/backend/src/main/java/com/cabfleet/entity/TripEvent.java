package com.cabfleet.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "trip_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String eventId;

    @Column(nullable = false)
    private String tripId;

    @Column(nullable = false)
    private String eventType;

    private Instant occurredAt;

    @Column(columnDefinition = "TEXT")
    private String payload;
}
