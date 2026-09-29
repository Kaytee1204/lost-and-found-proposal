package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.common.exception.ErrorCode;
import com.sagasu.lostandfound_backend.config.JwtService;
import com.sagasu.lostandfound_backend.dto.AuthResponse;
import com.sagasu.lostandfound_backend.dto.LoginRequest;
import com.sagasu.lostandfound_backend.dto.RegisterRequest;
import com.sagasu.lostandfound_backend.dto.UserResponse;
import com.sagasu.lostandfound_backend.entity.Role;
import com.sagasu.lostandfound_backend.entity.User;
import com.sagasu.lostandfound_backend.entity.UserStatus;
import com.sagasu.lostandfound_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String phone = normalize(request.getPhone());
        String email = normalizeEmail(request.getEmail());
        if (phone == null && email == null) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        if (phone != null && userRepository.existsByPhone(phone)) {
            throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
        }

        if (email != null && userRepository.existsByEmailIgnoreCase(email)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = User.builder()
                .phone(phone)
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .role(Role.ROLE_USER)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser.getId(), savedUser.getPhone(), savedUser.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(UserResponse.from(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        String phone = normalize(request.getPhone());
        if (email == null && phone == null) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
        User user = (email != null ? userRepository.findByEmailIgnoreCase(email) : userRepository.findByPhone(phone))
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        if (user.getStatus() != UserStatus.ACTIVE || user.getDeletedAt() != null) {
            throw new AppException(ErrorCode.FORBIDDEN, "Tài khoản của bạn đã bị khóa");
        }

        String token = jwtService.generateToken(user.getId(), user.getPhone(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(UserResponse.from(user))
                .build();
    }

    public UserResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (user.getStatus() != UserStatus.ACTIVE || user.getDeletedAt() != null) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        return UserResponse.from(user);
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String normalizeEmail(String value) {
        String normalized = normalize(value);
        return normalized == null ? null : normalized.toLowerCase(Locale.ROOT);
    }
}
