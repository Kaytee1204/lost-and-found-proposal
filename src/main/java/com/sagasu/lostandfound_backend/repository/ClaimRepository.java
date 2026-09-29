package com.sagasu.lostandfound_backend.repository;

import com.sagasu.lostandfound_backend.entity.Claim;
import com.sagasu.lostandfound_backend.entity.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ClaimRepository extends JpaRepository<Claim, UUID> {
    List<Claim> findByFoundItemIdAndStatus(UUID foundItemId, ClaimStatus status);
    List<Claim> findByClaimerIdOrderByCreatedAtDesc(UUID claimerId);
    List<Claim> findByFoundItemIdOrderByCreatedAtDesc(UUID foundItemId);
}
