package com.sagasu.lostandfound_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "handovers")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Handover {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "claim_id", nullable = false, unique = true)
    private UUID claimId;
    @Column(name = "proposed_by", nullable = false)
    private UUID proposedBy;
    @Column(name = "confirmed_by")
    private UUID confirmedBy;
    @Builder.Default
    private String status = "PROPOSED";
    @Column(name = "proposed_at")
    private Instant proposedAt;
    @Column(name = "confirmed_at")
    private Instant confirmedAt;
    @PrePersist void onCreate() { proposedAt = Instant.now(); }
}
