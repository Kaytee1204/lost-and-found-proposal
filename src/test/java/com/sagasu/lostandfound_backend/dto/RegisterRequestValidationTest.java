package com.sagasu.lostandfound_backend.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RegisterRequestValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private RegisterRequest createValidRequest() {
        return RegisterRequest.builder()
                .fullName("Nguyen Van A")
                .email("test@example.com")
                .phone("0987654321")
                .password("Password@123")
                .build();
    }

    @Nested
    @DisplayName("Phone Validation Tests")
    class PhoneValidationTests {

        @ParameterizedTest
        @ValueSource(strings = {
                "0987654321", // Viettel 09
                "0387654321", // Viettel 03
                "0777654321", // Mobifone 07
                "0887654321", // Vinaphone 08
                "0567654321", // Vietnamobile 05
                "+84987654321", // Country code with +
                "84987654321"   // Country code without +
        })
        @DisplayName("Valid Vietnamese phone numbers should pass")
        void shouldPassValidPhone(String phone) {
            RegisterRequest request = createValidRequest();
            request.setPhone(phone);

            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);
            boolean phoneError = violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("phone"));
            assertFalse(phoneError, "Phone " + phone + " should be valid");
        }

        @ParameterizedTest
        @ValueSource(strings = {
                "0123456789", // Invalid old prefix
                "0243876543", // Landline
                "098765432",  // 9 digits (too short)
                "09876543210", // 11 digits (too long)
                "abcdefghij", // Non-digits
                "+84123456789", // Invalid prefix with +84
                ""            // Empty
        })
        @DisplayName("Invalid phone numbers should fail")
        void shouldFailInvalidPhone(String phone) {
            RegisterRequest request = createValidRequest();
            request.setPhone(phone);

            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);
            boolean phoneError = violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("phone"));
            assertTrue(phoneError, "Phone " + phone + " should be invalid");
        }
    }

    @Nested
    @DisplayName("Password Validation Tests")
    class PasswordValidationTests {

        @ParameterizedTest
        @ValueSource(strings = {
                "Password@123",
                "Secret#2024",
                "1234567@",
                "p@ssw0rd",
                "Test!12345",
                "a1$bcdef"
        })
        @DisplayName("Passwords with >= 8 chars, number and special char should pass")
        void shouldPassValidPassword(String password) {
            RegisterRequest request = createValidRequest();
            request.setPassword(password);

            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);
            boolean passwordError = violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password"));
            assertFalse(passwordError, "Password " + password + " should be valid");
        }

        @ParameterizedTest
        @ValueSource(strings = {
                "1234567",       // < 8 chars, no special char
                "12345@7",       // 7 chars (< 8) with special char and number
                "12345678",      // 8 chars but no special char
                "abcdefgh",      // 8 chars but no number and no special char
                "abcdefg@",      // 8 chars with special char but no number
                "Abcdefgh!",     // 9 chars with special char but no number
                "1234567890",    // Numbers only
                ""               // Empty
        })
        @DisplayName("Invalid passwords should fail")
        void shouldFailInvalidPassword(String password) {
            RegisterRequest request = createValidRequest();
            request.setPassword(password);

            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);
            boolean passwordError = violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password"));
            assertTrue(passwordError, "Password " + password + " should be invalid");
        }
    }
}
