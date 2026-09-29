package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.common.exception.ErrorCode;
import com.sagasu.lostandfound_backend.dto.ChatRoomResponse;
import com.sagasu.lostandfound_backend.dto.MessageResponse;
import com.sagasu.lostandfound_backend.dto.SendMessageRequest;
import com.sagasu.lostandfound_backend.entity.ChatRoom;
import com.sagasu.lostandfound_backend.entity.Claim;
import com.sagasu.lostandfound_backend.entity.Message;
import com.sagasu.lostandfound_backend.repository.ChatRoomRepository;
import com.sagasu.lostandfound_backend.repository.ItemRepository;
import com.sagasu.lostandfound_backend.repository.MessageRepository;
import com.sagasu.lostandfound_backend.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRoomRepository rooms;
    private final MessageRepository messages;
    private final ClaimRepository claims;
    private final ItemRepository items;
    private final NotificationService notifications;

    public List<ChatRoomResponse> roomsFor(UUID actorId) {
        return rooms.findForParticipant(actorId).stream().map(ChatRoomResponse::from).toList();
    }

    public MessageResponse send(UUID actorId, UUID roomId, SendMessageRequest request) {
        ChatRoom room = permittedRoom(actorId, roomId);
        String content = request == null ? null : request.getContent();
        if (room.isClosed() || content == null || content.isBlank()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Room is closed or message is empty");
        }
        Message saved = messages.save(Message.builder().chatRoomId(roomId).senderId(actorId)
                .content(content.trim()).build());
        Claim claim = getClaim(room.getClaimId());
        UUID finderId = items.findById(claim.getFoundItemId()).orElseThrow().getUser().getId();
        UUID recipient = actorId.equals(claim.getClaimerId()) ? finderId : claim.getClaimerId();
        notifications.create(recipient, "NEW_MESSAGE", "MESSAGE", saved.getId(), "You have a new message");
        return MessageResponse.from(saved);
    }

    public List<MessageResponse> history(UUID actorId, UUID roomId) {
        permittedRoom(actorId, roomId);
        return messages.findByChatRoomIdOrderByCreatedAtAsc(roomId).stream()
                .map(MessageResponse::from).toList();
    }

    private ChatRoom permittedRoom(UUID actorId, UUID roomId) {
        ChatRoom room = rooms.findById(roomId).orElseThrow(() -> new AppException(ErrorCode.BAD_REQUEST, "Room not found"));
        Claim claim = getClaim(room.getClaimId());
        UUID finderId = items.findById(claim.getFoundItemId()).orElseThrow().getUser().getId();
        if (!actorId.equals(claim.getClaimerId()) && !actorId.equals(finderId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        return room;
    }

    private Claim getClaim(UUID claimId) {
        return claims.findById(claimId)
                .orElseThrow(() -> new AppException(ErrorCode.BAD_REQUEST, "Claim not found"));
    }
}
