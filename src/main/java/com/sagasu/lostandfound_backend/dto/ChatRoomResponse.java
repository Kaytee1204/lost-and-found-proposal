package com.sagasu.lostandfound_backend.dto;

import com.sagasu.lostandfound_backend.entity.ChatRoom;
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
public class ChatRoomResponse {
    private UUID id;
    private UUID claimId;
    private boolean closed;
    private Instant createdAt;
    private Instant closedAt;

    public static ChatRoomResponse from(ChatRoom room) {
        return ChatRoomResponse.builder().id(room.getId()).claimId(room.getClaimId())
                .closed(room.isClosed()).createdAt(room.getCreatedAt()).closedAt(room.getClosedAt()).build();
    }
}
