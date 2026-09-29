package com.sagasu.lostandfound_backend.controller;

import com.sagasu.lostandfound_backend.common.api.ApiResponse;
import com.sagasu.lostandfound_backend.common.util.SecurityUtils;
import com.sagasu.lostandfound_backend.dto.NotificationResponse;
import com.sagasu.lostandfound_backend.service.NotificationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {
    private final NotificationService notifications;

    @GetMapping
    public ApiResponse<List<NotificationResponse>> list() {
        return ApiResponse.ok(notifications.list(SecurityUtils.getCurrentUserId()));
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<NotificationResponse> markRead(@PathVariable UUID id) {
        return ApiResponse.ok(notifications.markRead(SecurityUtils.getCurrentUserId(), id));
    }
}
