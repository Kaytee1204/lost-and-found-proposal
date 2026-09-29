package com.sagasu.lostandfound_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "claim_exchanges")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ClaimExchange {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "claim_id", nullable = false)
    private UUID claimId;
    @Column(name = "sender_id", nullable = false)
    private UUID senderId;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    @Column(name = "created_at")
    private Instant createdAt;
    @PrePersist void onCreate() { createdAt = Instant.now(); }
}
