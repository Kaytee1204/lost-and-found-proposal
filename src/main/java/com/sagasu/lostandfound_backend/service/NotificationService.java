package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.common.exception.ErrorCode;
import com.sagasu.lostandfound_backend.entity.Notification;
import com.sagasu.lostandfound_backend.dto.NotificationResponse;
import com.sagasu.lostandfound_backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notifications;

    @Transactional
    public NotificationResponse create(UUID userId, String type, String refType, UUID refId, String content) {
        return NotificationResponse.from(notifications.save(Notification.builder().userId(userId).type(type)
                .refType(refType).refId(refId).content(content).build()));
    }

    public List<NotificationResponse> list(UUID userId) {
        return notifications.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationResponse::from).toList();
    }

    @Transactional
    public NotificationResponse markRead(UUID userId, UUID notificationId) {
        Notification notification = notifications.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.BAD_REQUEST, "Notification not found"));
        if (!notification.getUserId().equals(userId)) throw new AppException(ErrorCode.FORBIDDEN);
        notification.setRead(true);
        notification.setReadAt(Instant.now());
        return NotificationResponse.from(notifications.save(notification));
    }
}
