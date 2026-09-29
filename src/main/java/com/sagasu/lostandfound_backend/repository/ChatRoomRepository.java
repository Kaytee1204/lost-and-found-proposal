package com.sagasu.lostandfound_backend.repository;

import com.sagasu.lostandfound_backend.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {
    Optional<ChatRoom> findByClaimId(UUID claimId);

    @Query(value = """
            SELECT r.* FROM chat_rooms r
            JOIN claims c ON c.id = r.claim_id
            JOIN items i ON i.id = c.found_item_id
            WHERE c.claimer_id = :userId OR i.user_id = :userId
            ORDER BY r.created_at DESC
            """, nativeQuery = true)
    List<ChatRoom> findForParticipant(@Param("userId") UUID userId);
}
