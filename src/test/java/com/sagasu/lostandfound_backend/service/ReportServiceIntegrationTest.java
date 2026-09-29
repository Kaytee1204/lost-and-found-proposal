package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.dto.LoginRequest;
import com.sagasu.lostandfound_backend.dto.RegisterRequest;
import com.sagasu.lostandfound_backend.dto.SubmitReportRequest;
import com.sagasu.lostandfound_backend.dto.ResolveReportRequest;
import com.sagasu.lostandfound_backend.entity.Role;
import com.sagasu.lostandfound_backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
class ReportServiceIntegrationTest {
    @Autowired AuthService auth;
    @Autowired ReportService reports;
    @Autowired UserRepository users;

    @Test
    void adminCanResolveUserReportAndLockAccount() {
        String targetEmail = "target-" + UUID.randomUUID() + "@example.com";
        UUID target = register(targetEmail);
        UUID reporter = register("reporter-" + UUID.randomUUID() + "@example.com");
        UUID admin = register("admin-" + UUID.randomUUID() + "@example.com");
        var adminUser = users.findById(admin).orElseThrow();
        adminUser.setRole(Role.ROLE_ADMIN);
        users.saveAndFlush(adminUser);

        var report = reports.submit(reporter, SubmitReportRequest.builder().targetType("USER")
                .targetId(target).reason("FRAUD").description("False ownership claim").build());
        var decision = ResolveReportRequest.builder().action("LOCK_USER").adminNote("Confirmed").build();
        assertThrows(AppException.class, () -> reports.resolve(reporter, report.getId(), decision));
        assertEquals("RESOLVED", reports.resolve(admin, report.getId(), decision).getStatus());
        assertThrows(AppException.class, () -> auth.login(LoginRequest.builder()
                .email(targetEmail).password("Password@123").build()));
    }

    private UUID register(String email) {
        return auth.register(RegisterRequest.builder().fullName("User")
                .email(email).password("Password@123").build()).getUser().getId();
    }
}
