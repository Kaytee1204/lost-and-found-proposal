package com.sagasu.lostandfound_backend.dto;

import com.sagasu.lostandfound_backend.entity.Message;
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
public class MessageResponse {
    private UUID id;
    private UUID chatRoomId;
    private UUID senderId;
    private String content;
    private Instant createdAt;

    public static MessageResponse from(Message message) {
        return MessageResponse.builder().id(message.getId()).chatRoomId(message.getChatRoomId())
                .senderId(message.getSenderId()).content(message.getContent())
                .createdAt(message.getCreatedAt()).build();
    }
}
