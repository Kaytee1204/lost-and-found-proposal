package com.sagasu.lostandfound_backend.controller;

import com.sagasu.lostandfound_backend.common.api.ApiResponse;
import com.sagasu.lostandfound_backend.common.util.SecurityUtils;
import com.sagasu.lostandfound_backend.dto.AdminDashboardResponse;
import com.sagasu.lostandfound_backend.dto.ReportResponse;
import com.sagasu.lostandfound_backend.dto.ResolveReportRequest;
import com.sagasu.lostandfound_backend.service.ReportService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {
    private final ReportService reports;

    @GetMapping("/reports")
    public ApiResponse<List<ReportResponse>> pendingReports() {
        return ApiResponse.ok(reports.pending(SecurityUtils.getCurrentUserId()));
    }

    @PatchMapping("/reports/{id}/resolve")
    public ApiResponse<ReportResponse> resolve(@PathVariable UUID id, @Valid @RequestBody ResolveReportRequest request) {
        return ApiResponse.ok(reports.resolve(SecurityUtils.getCurrentUserId(), id, request));
    }

    @GetMapping("/dashboard")
    public ApiResponse<AdminDashboardResponse> dashboard() {
        return ApiResponse.ok(reports.dashboard(SecurityUtils.getCurrentUserId()));
    }

}
