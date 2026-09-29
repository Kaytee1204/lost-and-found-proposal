package com.sagasu.lostandfound_backend.repository;

import com.sagasu.lostandfound_backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findByChatRoomIdOrderByCreatedAtAsc(UUID chatRoomId);
}
