package com.sagasu.lostandfound_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "admin_logs")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AdminLog {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "admin_id", nullable = false)
    private UUID adminId;
    @Column(nullable = false)
    private String action;
    @Column(name = "target_type")
    private String targetType;
    @Column(name = "target_id")
    private UUID targetId;
    private String note;
    @Column(name = "created_at")
    private Instant createdAt;
    @PrePersist void onCreate() { createdAt = Instant.now(); }
}
