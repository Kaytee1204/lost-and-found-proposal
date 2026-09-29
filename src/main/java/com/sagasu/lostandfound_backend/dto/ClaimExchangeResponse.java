package com.sagasu.lostandfound_backend.dto;

import com.sagasu.lostandfound_backend.entity.ClaimExchange;
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
public class ClaimExchangeResponse {
    private UUID id;
    private UUID claimId;
    private UUID senderId;
    private String content;
    private Instant createdAt;

    public static ClaimExchangeResponse from(ClaimExchange exchange) {
        return ClaimExchangeResponse.builder().id(exchange.getId()).claimId(exchange.getClaimId())
                .senderId(exchange.getSenderId()).content(exchange.getContent())
                .createdAt(exchange.getCreatedAt()).build();
    }
}
