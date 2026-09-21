package com.sagasu.lostandfound_backend.controller;

import com.sagasu.lostandfound_backend.common.api.ApiResponse;
import com.sagasu.lostandfound_backend.common.api.PageResponse;
import com.sagasu.lostandfound_backend.common.util.SecurityUtils;
import com.sagasu.lostandfound_backend.dto.CloseItemRequest;
import com.sagasu.lostandfound_backend.dto.CreateItemRequest;
import com.sagasu.lostandfound_backend.dto.ItemResponse;
import com.sagasu.lostandfound_backend.entity.ItemStatus;
import com.sagasu.lostandfound_backend.entity.ItemType;
import com.sagasu.lostandfound_backend.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
@Tag(name = "2. Lost & Found Items", description = "Quản lý bài đăng đồ thất lạc và đồ nhặt được")
public class ItemController {

    private final ItemService itemService;

    @PostMapping("/lost")
    @Operation(summary = "Đăng bài Lost Item (Báo mất đồ)", description = "Đăng tin báo mất đồ")
    public ResponseEntity<ApiResponse<ItemResponse>> createLostItem(
            @Valid @RequestBody CreateItemRequest request
    ) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        ItemResponse response = itemService.createLostItem(currentUserId, request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng tin báo mất thành công", response));
    }

    @PostMapping("/found")
    @Operation(summary = "Đăng bài Found Item (Báo nhặt được đồ)", description = "Đăng tin nhặt được đồ")
    public ResponseEntity<ApiResponse<ItemResponse>> createFoundItem(
            @Valid @RequestBody CreateItemRequest request
    ) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        ItemResponse response = itemService.createFoundItem(currentUserId, request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng tin báo nhặt thành công", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết đồ vật", description = "Lấy thông tin chi tiết một đồ vật theo ID")
    public ResponseEntity<ApiResponse<ItemResponse>> getItemById(@PathVariable UUID id) {
        ItemResponse response = itemService.getItemById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @Operation(summary = "Tìm kiếm & Lọc danh sách đồ vật", description = "Tìm kiếm theo từ khóa, lọc theo loại LOST/FOUND, trạng thái, danh mục có phân trang")
    public ResponseEntity<ApiResponse<PageResponse<ItemResponse>>> getItems(
            @RequestParam(required = false) ItemType type,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = "asc".equalsIgnoreCase(direction) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<ItemResponse> response = itemService.getItems(type, status, category, keyword, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/my-posts")
    @Operation(summary = "Danh sách bài đăng của tôi", description = "Xem lại toàn bộ bài đăng báo mất và báo nhặt của chính tài khoản hiện tại")
    public ResponseEntity<ApiResponse<PageResponse<ItemResponse>>> getMyItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<ItemResponse> response = itemService.getMyItems(currentUserId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping("/{id}/close")
    @Operation(summary = "Đóng bài / Đánh dấu đã nhận lại đồ (Returned)", description = "Chủ bài đăng xác nhận đã nhận lại đồ (RETURNED) hoặc đóng bài đăng (CLOSED)")
    public ResponseEntity<ApiResponse<ItemResponse>> closeItem(
            @PathVariable UUID id,
            @RequestBody(required = false) CloseItemRequest request
    ) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        ItemResponse response = itemService.closeItem(currentUserId, id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái thành công", response));
    }
}
