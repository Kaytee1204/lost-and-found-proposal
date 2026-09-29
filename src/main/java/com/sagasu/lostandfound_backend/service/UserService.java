package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.common.exception.ErrorCode;
import com.sagasu.lostandfound_backend.dto.UpdateProfileRequest;
import com.sagasu.lostandfound_backend.dto.UserResponse;
import com.sagasu.lostandfound_backend.entity.User;
import com.sagasu.lostandfound_backend.entity.UserStatus;
import com.sagasu.lostandfound_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null) {
            String phone = request.getPhone().trim();
            if (phone.isEmpty() && (user.getEmail() == null || user.getEmail().isBlank())) {
                throw new AppException(ErrorCode.BAD_REQUEST);
            }
            if (!phone.isEmpty() && !phone.equals(user.getPhone()) && userRepository.existsByPhone(phone)) {
                throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
            }
            user.setPhone(phone.isEmpty() ? null : phone);
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }
        if (request.getAddress() != null) user.setAddress(request.getAddress().trim());
        if (request.getBio() != null) user.setBio(request.getBio().trim());
        if (request.getNotifyByEmail() != null) user.setNotifyByEmail(request.getNotifyByEmail());
        if (request.getNotifyByPush() != null) user.setNotifyByPush(request.getNotifyByPush());
        if (request.getPreferredLanguage() != null && !request.getPreferredLanguage().isBlank()) {
            user.setPreferredLanguage(request.getPreferredLanguage().trim());
        }

        User updated = userRepository.save(user);
        return UserResponse.from(updated);
    }

    @Transactional
    public UserResponse updateUserStatus(UUID userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setStatus(status);
        return UserResponse.from(userRepository.save(user));
    }
}
