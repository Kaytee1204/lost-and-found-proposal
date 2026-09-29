package com.sagasu.lostandfound_backend.controller;

import com.sagasu.lostandfound_backend.common.api.ApiResponse;
import com.sagasu.lostandfound_backend.common.util.SecurityUtils;
import com.sagasu.lostandfound_backend.dto.ClaimDecisionRequest;
import com.sagasu.lostandfound_backend.dto.ClaimExchangeResponse;
import com.sagasu.lostandfound_backend.dto.ClaimInfoRequest;
import com.sagasu.lostandfound_backend.dto.ClaimResponse;
import com.sagasu.lostandfound_backend.dto.HandoverResponse;
import com.sagasu.lostandfound_backend.dto.SubmitClaimRequest;
import com.sagasu.lostandfound_backend.service.ClaimService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class ClaimController {
    private final ClaimService claims;

    @PostMapping("/api/v1/items/{itemId}/claims")
    public ApiResponse<ClaimResponse> submit(@PathVariable UUID itemId,
                                             @Valid @RequestBody SubmitClaimRequest request) {
        return ApiResponse.ok(claims.submit(SecurityUtils.getCurrentUserId(), itemId, request));
    }

    @GetMapping("/api/v1/claims/sent")
    public ApiResponse<List<ClaimResponse>> sent() {
        return ApiResponse.ok(claims.sent(SecurityUtils.getCurrentUserId()));
    }

    @GetMapping("/api/v1/claims/received")
    public ApiResponse<List<ClaimResponse>> received() {
        return ApiResponse.ok(claims.received(SecurityUtils.getCurrentUserId()));
    }

    @GetMapping("/api/v1/claims/{id}")
    public ApiResponse<ClaimResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(claims.getForUser(SecurityUtils.getCurrentUserId(), id));
    }

    @PatchMapping("/api/v1/claims/{id}/respond")
    public ApiResponse<ClaimResponse> respond(@PathVariable UUID id,
                                               @Valid @RequestBody ClaimDecisionRequest request) {
        return ApiResponse.ok(claims.respond(SecurityUtils.getCurrentUserId(), id, request));
    }

    @GetMapping("/api/v1/claims/{id}/info")
    public ApiResponse<List<ClaimExchangeResponse>> info(@PathVariable UUID id) {
        return ApiResponse.ok(claims.exchanges(SecurityUtils.getCurrentUserId(), id));
    }

    @PostMapping("/api/v1/claims/{id}/info")
    public ApiResponse<ClaimExchangeResponse> addInfo(@PathVariable UUID id,
                                                       @Valid @RequestBody ClaimInfoRequest request) {
        return ApiResponse.ok(claims.addInfo(SecurityUtils.getCurrentUserId(), id, request));
    }

    @PostMapping("/api/v1/claims/{id}/handover/propose")
    public ApiResponse<HandoverResponse> propose(@PathVariable UUID id) {
        return ApiResponse.ok(claims.proposeHandover(SecurityUtils.getCurrentUserId(), id));
    }

    @PostMapping("/api/v1/claims/{id}/handover/confirm")
    public ApiResponse<HandoverResponse> confirm(@PathVariable UUID id) {
        return ApiResponse.ok(claims.confirmHandover(SecurityUtils.getCurrentUserId(), id));
    }

}
