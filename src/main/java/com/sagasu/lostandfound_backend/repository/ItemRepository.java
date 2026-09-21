package com.sagasu.lostandfound_backend.repository;

import com.sagasu.lostandfound_backend.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ItemRepository extends JpaRepository<Item, UUID>, JpaSpecificationExecutor<Item> {
    Page<Item> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
}
