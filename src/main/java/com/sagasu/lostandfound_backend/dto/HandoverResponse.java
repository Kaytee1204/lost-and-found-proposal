package com.sagasu.lostandfound_backend.dto;

import com.sagasu.lostandfound_backend.entity.Handover;
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
public class HandoverResponse {
    private UUID id;
    private UUID claimId;
    private UUID proposedBy;
    private UUID confirmedBy;
    private String status;
    private Instant proposedAt;
    private Instant confirmedAt;

    public static HandoverResponse from(Handover handover) {
        return HandoverResponse.builder().id(handover.getId()).claimId(handover.getClaimId())
                .proposedBy(handover.getProposedBy()).confirmedBy(handover.getConfirmedBy())
                .status(handover.getStatus()).proposedAt(handover.getProposedAt())
                .confirmedAt(handover.getConfirmedAt()).build();
    }
}
