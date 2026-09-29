package com.sagasu.lostandfound_backend.dto;

import com.sagasu.lostandfound_backend.entity.Role;
import com.sagasu.lostandfound_backend.entity.User;
import com.sagasu.lostandfound_backend.entity.UserStatus;
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
public class UserResponse {
    private UUID id;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String address;
    private String bio;
    private Boolean notifyByEmail;
    private Boolean notifyByPush;
    private String preferredLanguage;
    private Role role;
    private UserStatus status;
    private Instant createdAt;

    public static UserResponse from(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .address(user.getAddress())
                .bio(user.getBio())
                .notifyByEmail(user.getNotifyByEmail())
                .notifyByPush(user.getNotifyByPush())
                .preferredLanguage(user.getPreferredLanguage())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
