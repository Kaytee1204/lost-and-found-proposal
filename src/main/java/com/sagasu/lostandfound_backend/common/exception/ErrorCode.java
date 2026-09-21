package com.sagasu.lostandfound_backend.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"),
    PHONE_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "Số điện thoại đã được sử dụng"),
    EMAIL_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "Email đã được sử dụng"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Số điện thoại hoặc mật khẩu không chính xác"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Chưa xác thực hoặc token không hợp lệ"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện hành động này"),
    ITEM_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy thông tin đồ vật"),
    INVALID_STATE_TRANSITION(HttpStatus.BAD_REQUEST, "Trạng thái chuyển đổi không hợp lệ"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "Dữ liệu yêu cầu không hợp lệ"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi máy chủ nội bộ");

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
