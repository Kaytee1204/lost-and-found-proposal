package com.sagasu.lostandfound_backend.config;

import com.sagasu.lostandfound_backend.entity.Role;
import com.sagasu.lostandfound_backend.entity.User;
import com.sagasu.lostandfound_backend.entity.UserStatus;
import com.sagasu.lostandfound_backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JwtAuthenticationFilterTest {
    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void lockedUserCannotUseAnOldToken() throws Exception {
        UUID id = UUID.randomUUID();
        JwtService jwt = mock(JwtService.class);
        UserRepository users = mock(UserRepository.class);
        when(jwt.validateToken("valid-token")).thenReturn(true);
        when(jwt.extractUserId("valid-token")).thenReturn(id);
        when(users.findById(id)).thenReturn(Optional.of(User.builder()
                .id(id).role(Role.ROLE_USER).status(UserStatus.LOCKED).build()));
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer valid-token");

        new JwtAuthenticationFilter(jwt, users).doFilterInternal(
                request, new MockHttpServletResponse(), mock(FilterChain.class));

        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void activeUserAuthorityComesFromDatabase() throws Exception {
        UUID id = UUID.randomUUID();
        JwtService jwt = mock(JwtService.class);
        UserRepository users = mock(UserRepository.class);
        when(jwt.validateToken("valid-token")).thenReturn(true);
        when(jwt.extractUserId("valid-token")).thenReturn(id);
        when(users.findById(id)).thenReturn(Optional.of(User.builder()
                .id(id).role(Role.ROLE_USER).status(UserStatus.ACTIVE).build()));
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer valid-token");

        new JwtAuthenticationFilter(jwt, users).doFilterInternal(
                request, new MockHttpServletResponse(), mock(FilterChain.class));

        assertEquals("ROLE_USER", SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next().getAuthority());
    }
}
