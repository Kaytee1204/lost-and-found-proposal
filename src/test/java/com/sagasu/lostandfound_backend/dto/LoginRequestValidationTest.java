package com.sagasu.lostandfound_backend.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LoginRequestValidationTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void acceptsEmailWithoutPhone() {
        LoginRequest request = LoginRequest.builder().email("user@example.com").password("Password@123").build();
        assertTrue(validator.validate(request).isEmpty());
    }

    @Test
    void rejectsMissingIdentifier() {
        LoginRequest request = LoginRequest.builder().password("Password@123").build();
        assertFalse(validator.validate(request).isEmpty());
    }
}
