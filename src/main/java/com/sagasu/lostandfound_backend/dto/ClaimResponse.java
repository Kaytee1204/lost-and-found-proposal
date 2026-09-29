package com.sagasu.lostandfound_backend.dto;

import com.sagasu.lostandfound_backend.entity.Claim;
import com.sagasu.lostandfound_backend.entity.ClaimStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimResponse {
    private UUID id;
    private UUID foundItemId;
    private UUID lostItemId;
    private UUID claimerId;
    private String identifyingDetails;
    private String additionalPhotoUrl;
    private String contactPhone;
    private String contactEmail;
    private String note;
    private ClaimStatus status;
    private String responseNote;
    private Instant decidedAt;
    private Instant createdAt;
    private Instant updatedAt;

    public static ClaimResponse from(Claim claim) {
        return ClaimResponse.builder()
                .id(claim.getId()).foundItemId(claim.getFoundItemId())
                .lostItemId(claim.getLostItemId()).claimerId(claim.getClaimerId())
                .identifyingDetails(claim.getIdentifyingDetails())
                .additionalPhotoUrl(claim.getAdditionalPhotoUrl())
                .contactPhone(claim.getContactPhone()).contactEmail(claim.getContactEmail())
                .note(claim.getNote()).status(claim.getStatus()).responseNote(claim.getResponseNote())
                .decidedAt(claim.getDecidedAt()).createdAt(claim.getCreatedAt())
                .updatedAt(claim.getUpdatedAt()).build();
    }
}
