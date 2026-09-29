package com.sagasu.lostandfound_backend.repository;

import com.sagasu.lostandfound_backend.entity.Handover;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface HandoverRepository extends JpaRepository<Handover, UUID> {
    Optional<Handover> findByClaimId(UUID claimId);
}
