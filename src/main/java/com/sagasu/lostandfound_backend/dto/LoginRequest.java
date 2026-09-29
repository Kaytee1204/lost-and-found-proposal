package com.sagasu.lostandfound_backend.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    private String phone;

    @Email(message = "Email không đúng định dạng")
    private String email;

    @AssertTrue(message = "Email hoặc số điện thoại là bắt buộc")
    public boolean isIdentifierProvided() {
        return (phone != null && !phone.isBlank()) || (email != null && !email.isBlank());
    }

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}
