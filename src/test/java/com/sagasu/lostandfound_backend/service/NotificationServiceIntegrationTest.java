package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Transactional
class NotificationServiceIntegrationTest {
    @Autowired AuthService auth;
    @Autowired NotificationService notifications;

    @Test
    void onlyRecipientCanMarkNotificationRead() {
        UUID recipient = register();
        UUID other = register();
        var created = notifications.create(recipient, "CLAIM_RESPONSE", null, null, "Your claim was approved");
        assertEquals(1, notifications.list(recipient).size());
        assertThrows(AppException.class, () -> notifications.markRead(other, created.getId()));
        assertTrue(notifications.markRead(recipient, created.getId()).isRead());
    }

    private UUID register() {
        return auth.register(RegisterRequest.builder().fullName("User")
                .email("notify-" + UUID.randomUUID() + "@example.com")
                .password("Password@123").build()).getUser().getId();
    }
}
