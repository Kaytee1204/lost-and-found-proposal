package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.dto.AuthResponse;
import com.sagasu.lostandfound_backend.dto.LoginRequest;
import com.sagasu.lostandfound_backend.dto.RegisterRequest;
import com.sagasu.lostandfound_backend.entity.UserStatus;
import com.sagasu.lostandfound_backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
class AuthServiceIntegrationTest {
    @Autowired AuthService authService;
    @Autowired UserRepository userRepository;

    @Test
    void emailOnlyAccountCanRegisterAndSignInCaseInsensitively() {
        String email = "mvp-" + UUID.randomUUID() + "@example.com";
        AuthResponse registered = authService.register(RegisterRequest.builder()
                .fullName("Email User").email(email.toUpperCase())
                .password("Password@123").build());

        assertNotNull(registered.getToken());
        assertEquals(email, registered.getUser().getEmail());
        AuthResponse signedIn = authService.login(LoginRequest.builder()
                .email(email.toUpperCase()).password("Password@123").build());
        assertEquals(registered.getUser().getId(), signedIn.getUser().getId());
    }

    @Test
    void lockedAccountCannotSignIn() {
        String phone = "09" + String.valueOf(System.nanoTime()).substring(0, 8);
        AuthResponse registered = authService.register(RegisterRequest.builder()
                .fullName("Locked User").phone(phone).password("Password@123").build());
        var user = userRepository.findById(registered.getUser().getId()).orElseThrow();
        user.setStatus(UserStatus.LOCKED);
        userRepository.saveAndFlush(user);

        assertThrows(RuntimeException.class, () -> authService.login(LoginRequest.builder()
                .phone(phone).password("Password@123").build()));
    }
}
