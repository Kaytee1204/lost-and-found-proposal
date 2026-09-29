package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.dto.RegisterRequest;
import com.sagasu.lostandfound_backend.dto.UpdateProfileRequest;
import com.sagasu.lostandfound_backend.dto.UserResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
class UserServiceIntegrationTest {
    @Autowired AuthService authService;
    @Autowired UserService userService;

    @Test
    void profileStoresMvpPreferencesAndRejectsDuplicatePhone() {
        String email = "profile-" + UUID.randomUUID() + "@example.com";
        UUID userId = authService.register(RegisterRequest.builder()
                .fullName("Profile User").email(email).password("Password@123").build()).getUser().getId();

        UserResponse updated = userService.updateProfile(userId, UpdateProfileRequest.builder()
                .address("Library dormitory").bio("Student")
                .notifyByEmail(false).notifyByPush(true).preferredLanguage("en").build());
        assertEquals("Library dormitory", updated.getAddress());
        assertEquals(false, updated.getNotifyByEmail());
        assertEquals(true, updated.getNotifyByPush());

        assertThrows(AppException.class, () -> userService.updateProfile(userId,
                UpdateProfileRequest.builder().phone("0987654321").build()));
    }
}
