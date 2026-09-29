package com.sagasu.lostandfound_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "claims")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Claim {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "found_item_id", nullable = false)
    private UUID foundItemId;
    @Column(name = "lost_item_id")
    private UUID lostItemId;
    @Column(name = "claimer_id", nullable = false)
    private UUID claimerId;
    @Column(name = "identifying_details", nullable = false, columnDefinition = "TEXT")
    private String identifyingDetails;
    @Column(name = "additional_photo_url")
    private String additionalPhotoUrl;
    @Column(name = "contact_phone")
    private String contactPhone;
    @Column(name = "contact_email")
    private String contactEmail;
    @Column(name = "note")
    private String note;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private ClaimStatus status = ClaimStatus.WAITING_FINDER_VERIFICATION;
    @Column(name = "response_note")
    private String responseNote;
    @Column(name = "decided_at")
    private Instant decidedAt;
    @Column(name = "created_at")
    private Instant createdAt;
    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist void onCreate() {
        createdAt = Instant.now();
        updatedAt = createdAt;
    }
    @PreUpdate void onUpdate() { updatedAt = Instant.now(); }
}
