package com.sagasu.lostandfound_backend.repository;

import com.sagasu.lostandfound_backend.entity.ClaimExchange;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ClaimExchangeRepository extends JpaRepository<ClaimExchange, UUID> {
    List<ClaimExchange> findByClaimIdOrderByCreatedAtAsc(UUID claimId);
}
