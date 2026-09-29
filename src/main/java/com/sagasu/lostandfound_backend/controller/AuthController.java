package com.sagasu.lostandfound_backend.controller;

import com.sagasu.lostandfound_backend.common.api.ApiResponse;
import com.sagasu.lostandfound_backend.common.util.SecurityUtils;
import com.sagasu.lostandfound_backend.dto.AuthResponse;
import com.sagasu.lostandfound_backend.dto.LoginRequest;
import com.sagasu.lostandfound_backend.dto.RegisterRequest;
import com.sagasu.lostandfound_backend.dto.UserResponse;
import com.sagasu.lostandfound_backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "1. Authentication", description = "Các API đăng ký, đăng nhập và thông tin tài khoản hiện tại")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản mới", description = "Tạo tài khoản người dùng mới và nhận JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng ký tài khoản thành công", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập", description = "Đăng nhập bằng số điện thoại và mật khẩu để nhận Bearer JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", response));
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Lấy thông tin tài khoản hiện tại", description = "Xem profile người dùng đang đăng nhập qua token")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        UserResponse response = authService.getCurrentUser(currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
