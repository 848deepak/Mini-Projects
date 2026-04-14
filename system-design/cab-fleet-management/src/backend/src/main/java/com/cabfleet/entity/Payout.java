package com.cabfleet.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "payouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payout {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String payoutId;

    @Column(nullable = false)
    private String driverId;

    private Instant periodStart;
    private Instant periodEnd;

    private Double grossAmount;
    private Double commissionAmount;
    private Double netAmount;
    private Integer tripCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayoutStatus status;

    private Instant createdAt;
    private Instant processedAt;

    public enum PayoutStatus {
        PENDING, PROCESSING, COMPLETED, FAILED
    }
}
