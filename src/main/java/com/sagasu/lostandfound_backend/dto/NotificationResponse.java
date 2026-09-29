package com.sagasu.lostandfound_backend.dto;

import com.sagasu.lostandfound_backend.entity.Notification;
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
public class NotificationResponse {
    private UUID id;
    private UUID userId;
    private String type;
    private String refType;
    private UUID refId;
    private String content;
    private boolean read;
    private Instant createdAt;
    private Instant readAt;

    public static NotificationResponse from(Notification notification) {
        return NotificationResponse.builder().id(notification.getId()).userId(notification.getUserId())
                .type(notification.getType()).refType(notification.getRefType())
                .refId(notification.getRefId()).content(notification.getContent())
                .read(notification.isRead()).createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt()).build();
    }
}
