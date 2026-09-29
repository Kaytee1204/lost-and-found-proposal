package com.sagasu.lostandfound_backend.controller;

import com.sagasu.lostandfound_backend.common.api.ApiResponse;
import com.sagasu.lostandfound_backend.common.util.SecurityUtils;
import com.sagasu.lostandfound_backend.dto.ChatRoomResponse;
import com.sagasu.lostandfound_backend.dto.MessageResponse;
import com.sagasu.lostandfound_backend.dto.SendMessageRequest;
import com.sagasu.lostandfound_backend.service.ChatService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat/rooms")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class ChatController {
    private final ChatService chats;

    @GetMapping
    public ApiResponse<List<ChatRoomResponse>> rooms() {
        return ApiResponse.ok(chats.roomsFor(SecurityUtils.getCurrentUserId()));
    }

    @GetMapping("/{roomId}/messages")
    public ApiResponse<List<MessageResponse>> history(@PathVariable UUID roomId) {
        return ApiResponse.ok(chats.history(SecurityUtils.getCurrentUserId(), roomId));
    }

    @PostMapping("/{roomId}/messages")
    public ApiResponse<MessageResponse> send(@PathVariable UUID roomId,
                                              @Valid @RequestBody SendMessageRequest request) {
        return ApiResponse.ok(chats.send(SecurityUtils.getCurrentUserId(), roomId, request));
    }
}
