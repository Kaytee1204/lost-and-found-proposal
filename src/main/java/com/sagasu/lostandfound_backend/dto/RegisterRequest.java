package com.sagasu.lostandfound_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    @Pattern(
        regexp = "^(0|\\+84|84)[35789]\\d{8}$",
        message = "Số điện thoại không đúng định dạng của Việt Nam"
    )
    private String phone;

    @Email(message = "Email không đúng định dạng")
    private String email;

    @AssertTrue(message = "Email hoặc số điện thoại là bắt buộc")
    public boolean isContactProvided() {
        return (phone != null && !phone.isBlank()) || (email != null && !email.isBlank());
    }

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu phải có tối thiểu 8 ký tự")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[^a-zA-Z0-9\\s]).{8,}$",
        message = "Mật khẩu phải có tối thiểu 8 ký tự, bao gồm ít nhất một chữ số và một ký tự đặc biệt"
    )
    private String password;
}
