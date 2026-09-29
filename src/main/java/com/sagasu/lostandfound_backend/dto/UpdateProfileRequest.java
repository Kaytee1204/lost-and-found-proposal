package com.sagasu.lostandfound_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String address;
    private String bio;
    private Boolean notifyByEmail;
    private Boolean notifyByPush;
    private String preferredLanguage;
}
