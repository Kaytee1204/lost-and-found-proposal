package com.sagasu.lostandfound_backend.controller;

import com.sagasu.lostandfound_backend.common.api.ApiResponse;
import com.sagasu.lostandfound_backend.common.util.SecurityUtils;
import com.sagasu.lostandfound_backend.dto.UpdateProfileRequest;
import com.sagasu.lostandfound_backend.dto.UserResponse;
import com.sagasu.lostandfound_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "1b. Users", description = "Các API cập nhật thông tin cá nhân")
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    @Operation(summary = "Cập nhật thông tin cá nhân", description = "Cập nhật họ tên, số điện thoại, avatar của tài khoản")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody UpdateProfileRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        UserResponse response = userService.updateProfile(currentUserId, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin thành công", response));
    }
}
