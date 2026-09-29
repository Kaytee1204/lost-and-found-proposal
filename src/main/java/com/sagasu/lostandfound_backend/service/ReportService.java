package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.common.exception.ErrorCode;
import com.sagasu.lostandfound_backend.common.util.ImageLink;
import com.sagasu.lostandfound_backend.dto.AdminDashboardResponse;
import com.sagasu.lostandfound_backend.dto.ReportResponse;
import com.sagasu.lostandfound_backend.dto.ResolveReportRequest;
import com.sagasu.lostandfound_backend.dto.SubmitReportRequest;
import com.sagasu.lostandfound_backend.entity.*;
import com.sagasu.lostandfound_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reports;
    private final AdminLogRepository adminLogs;
    private final UserRepository users;
    private final ItemRepository items;
    private final ClaimRepository claims;
    private final NotificationService notifications;

    @Transactional
    public ReportResponse submit(UUID reporterId, SubmitReportRequest request) {
        if (request == null || request.getTargetId() == null || request.getReason() == null
                || request.getReason().isBlank()) throw new AppException(ErrorCode.BAD_REQUEST);
        Report.ReportBuilder builder = Report.builder().reporterId(reporterId)
                .reason(request.getReason().trim()).description(request.getDescription())
                .evidenceImageUrl(ImageLink.validate(request.getEvidenceImageUrl()));
        UUID targetId = request.getTargetId();
        switch (request.getTargetType() == null ? "" : request.getTargetType()) {
            case "USER" -> {
                if (!users.existsById(targetId)) throw new AppException(ErrorCode.USER_NOT_FOUND);
                builder.targetUserId(targetId);
            }
            case "ITEM" -> {
                if (!items.existsById(targetId)) throw new AppException(ErrorCode.ITEM_NOT_FOUND);
                builder.targetItemId(targetId);
            }
            case "CLAIM" -> {
                if (!claims.existsById(targetId)) throw new AppException(ErrorCode.BAD_REQUEST);
                builder.targetClaimId(targetId);
            }
            default -> throw new AppException(ErrorCode.BAD_REQUEST, "Unsupported report target");
        }
        return ReportResponse.from(reports.save(builder.build()));
    }

    public List<ReportResponse> pending(UUID adminId) {
        requireAdmin(adminId);
        return reports.findByStatusOrderByCreatedAtAsc("PENDING").stream()
                .map(ReportResponse::from).toList();
    }

    @Transactional
    public ReportResponse resolve(UUID adminId, UUID reportId, ResolveReportRequest request) {
        requireAdmin(adminId);
        String action = request == null ? null : request.getAction();
        String note = request == null ? null : request.getAdminNote();
        Report report = reports.findById(reportId).orElseThrow(() -> new AppException(ErrorCode.BAD_REQUEST));
        if (!"PENDING".equals(report.getStatus())) throw new AppException(ErrorCode.INVALID_STATE_TRANSITION);
        switch (action == null ? "" : action) {
            case "DISMISS" -> report.setStatus("DISMISSED");
            case "LOCK_USER" -> {
                if (report.getTargetUserId() == null) throw new AppException(ErrorCode.BAD_REQUEST);
                User target = users.findById(report.getTargetUserId()).orElseThrow();
                target.setStatus(UserStatus.LOCKED);
                users.save(target);
                report.setStatus("RESOLVED");
            }
            case "CLOSE_ITEM" -> {
                if (report.getTargetItemId() == null) throw new AppException(ErrorCode.BAD_REQUEST);
                Item target = items.findById(report.getTargetItemId()).orElseThrow();
                target.setStatus(ItemStatus.CLOSED);
                items.save(target);
                report.setStatus("RESOLVED");
            }
            case "RESOLVE" -> report.setStatus("RESOLVED");
            default -> throw new AppException(ErrorCode.BAD_REQUEST, "Unsupported admin action");
        }
        report.setAdminNote(note);
        report.setResolvedBy(adminId);
        report.setResolvedAt(Instant.now());
        adminLogs.save(AdminLog.builder().adminId(adminId).action(action).targetType("REPORT")
                .targetId(reportId).note(note).build());
        notifications.create(report.getReporterId(), "REPORT_RESOLVED", "REPORT", reportId,
                "Your report was reviewed");
        return ReportResponse.from(reports.save(report));
    }

    public AdminDashboardResponse dashboard(UUID adminId) {
        requireAdmin(adminId);
        return AdminDashboardResponse.builder().users(users.count()).items(items.count())
                .claims(claims.count()).pendingReports(reports.countByStatus("PENDING")).build();
    }

    private void requireAdmin(UUID userId) {
        User user = users.findById(userId).orElseThrow(() -> new AppException(ErrorCode.FORBIDDEN));
        if (user.getRole() != Role.ROLE_ADMIN || user.getStatus() != UserStatus.ACTIVE
                || user.getDeletedAt() != null) throw new AppException(ErrorCode.FORBIDDEN);
    }
}
