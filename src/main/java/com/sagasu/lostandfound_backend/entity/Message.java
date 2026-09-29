package com.sagasu.lostandfound_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Message {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "chat_room_id", nullable = false)
    private UUID chatRoomId;
    @Column(name = "sender_id", nullable = false)
    private UUID senderId;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    @Column(name = "created_at")
    private Instant createdAt;
    @PrePersist void onCreate() { createdAt = Instant.now(); }
}
