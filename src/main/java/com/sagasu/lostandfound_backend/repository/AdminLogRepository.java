package com.sagasu.lostandfound_backend.repository;

import com.sagasu.lostandfound_backend.entity.AdminLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AdminLogRepository extends JpaRepository<AdminLog, UUID> {}
