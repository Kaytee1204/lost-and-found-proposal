package com.sagasu.lostandfound_backend.controller;

import com.sagasu.lostandfound_backend.common.api.ApiResponse;
import com.sagasu.lostandfound_backend.common.util.SecurityUtils;
import com.sagasu.lostandfound_backend.dto.ReportResponse;
import com.sagasu.lostandfound_backend.dto.SubmitReportRequest;
import com.sagasu.lostandfound_backend.service.ReportService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class ReportController {
    private final ReportService reports;

    @PostMapping
    public ApiResponse<ReportResponse> submit(@Valid @RequestBody SubmitReportRequest request) {
        return ApiResponse.ok(reports.submit(SecurityUtils.getCurrentUserId(), request));
    }
}
