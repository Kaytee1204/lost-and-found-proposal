package com.sagasu.lostandfound_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    @Column(nullable = false)
    private String type;
    @Column(name = "ref_type")
    private String refType;
    @Column(name = "ref_id")
    private UUID refId;
    private String content;
    @Builder.Default
    @Column(name = "is_read", nullable = false)
    private boolean read = false;
    @Column(name = "created_at")
    private Instant createdAt;
    @Column(name = "read_at")
    private Instant readAt;
    @PrePersist void onCreate() { createdAt = Instant.now(); }
}
