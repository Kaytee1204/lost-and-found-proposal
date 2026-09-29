package com.sagasu.lostandfound_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "chat_rooms")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ChatRoom {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "claim_id", nullable = false, unique = true)
    private UUID claimId;
    @Builder.Default
    @Column(name = "is_closed", nullable = false)
    private boolean closed = false;
    @Column(name = "created_at")
    private Instant createdAt;
    @Column(name = "closed_at")
    private Instant closedAt;
    @PrePersist void onCreate() { createdAt = Instant.now(); }
}
