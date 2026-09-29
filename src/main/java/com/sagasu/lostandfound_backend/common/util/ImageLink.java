package com.sagasu.lostandfound_backend.common.util;

import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.common.exception.ErrorCode;

import java.net.URI;

public final class ImageLink {
    private ImageLink() {}

    public static String validate(String value) {
        if (value == null) return null;
        if (value.isBlank() || value.length() > 500 || value.chars().anyMatch(Character::isWhitespace)) {
            throw invalid();
        }
        try {
            URI uri = URI.create(value);
            if (!"https".equalsIgnoreCase(uri.getScheme()) || uri.getHost() == null
                    || uri.getHost().isBlank() || uri.getUserInfo() != null) {
                throw invalid();
            }
            return value;
        } catch (IllegalArgumentException ex) {
            throw invalid();
        }
    }

    private static AppException invalid() {
        return new AppException(ErrorCode.BAD_REQUEST, "Image URL must be an HTTPS link of at most 500 characters");
    }
}
