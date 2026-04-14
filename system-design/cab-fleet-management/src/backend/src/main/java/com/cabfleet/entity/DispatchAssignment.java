package com.cabfleet.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "dispatch_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DispatchAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String assignmentId;

    @Column(nullable = false)
    private String requestId;

    @Column(nullable = false)
    private String driverId;

    private Instant offeredAt;
    private Instant expiresAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentState state;

    public enum AssignmentState {
        OFFERED, ACCEPTED, REJECTED, EXPIRED, CANCELLED
    }
}
