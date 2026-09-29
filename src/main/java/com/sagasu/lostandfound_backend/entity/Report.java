package com.sagasu.lostandfound_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reports")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Report {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "reporter_id", nullable = false)
    private UUID reporterId;
    @Column(name = "target_user_id")
    private UUID targetUserId;
    @Column(name = "target_item_id")
    private UUID targetItemId;
    @Column(name = "target_claim_id")
    private UUID targetClaimId;
    @Column(nullable = false)
    private String reason;
    private String description;
    @Column(name = "evidence_image_url")
    private String evidenceImageUrl;
    @Builder.Default
    private String status = "PENDING";
    @Column(name = "admin_note")
    private String adminNote;
    @Column(name = "resolved_by")
    private UUID resolvedBy;
    @Column(name = "created_at")
    private Instant createdAt;
    @Column(name = "resolved_at")
    private Instant resolvedAt;
    @PrePersist void onCreate() { createdAt = Instant.now(); }
}
