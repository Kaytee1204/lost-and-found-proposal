package com.sagasu.lostandfound_backend.dto;

import com.sagasu.lostandfound_backend.entity.Report;
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
public class ReportResponse {
    private UUID id;
    private UUID reporterId;
    private UUID targetUserId;
    private UUID targetItemId;
    private UUID targetClaimId;
    private String reason;
    private String description;
    private String evidenceImageUrl;
    private String status;
    private String adminNote;
    private UUID resolvedBy;
    private Instant createdAt;
    private Instant resolvedAt;

    public static ReportResponse from(Report report) {
        return ReportResponse.builder().id(report.getId()).reporterId(report.getReporterId())
                .targetUserId(report.getTargetUserId()).targetItemId(report.getTargetItemId())
                .targetClaimId(report.getTargetClaimId()).reason(report.getReason())
                .description(report.getDescription()).evidenceImageUrl(report.getEvidenceImageUrl())
                .status(report.getStatus()).adminNote(report.getAdminNote())
                .resolvedBy(report.getResolvedBy()).createdAt(report.getCreatedAt())
                .resolvedAt(report.getResolvedAt()).build();
    }
}
