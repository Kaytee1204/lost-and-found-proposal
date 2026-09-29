package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.dto.CreateItemRequest;
import com.sagasu.lostandfound_backend.dto.RegisterRequest;
import com.sagasu.lostandfound_backend.dto.SubmitClaimRequest;
import com.sagasu.lostandfound_backend.dto.ClaimDecisionRequest;
import com.sagasu.lostandfound_backend.dto.ClaimInfoRequest;
import com.sagasu.lostandfound_backend.dto.SendMessageRequest;
import com.sagasu.lostandfound_backend.entity.ClaimStatus;
import com.sagasu.lostandfound_backend.entity.ItemStatus;
import com.sagasu.lostandfound_backend.repository.ChatRoomRepository;
import com.sagasu.lostandfound_backend.repository.ItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
class ClaimHandoverIntegrationTest {
    @Autowired AuthService auth;
    @Autowired ItemService items;
    @Autowired ItemRepository itemRepository;
    @Autowired ClaimService claims;
    @Autowired ChatService chats;
    @Autowired ChatRoomRepository rooms;

    @Test
    void finderApprovesThenBothPartiesConfirmReturn() {
        UUID owner = register();
        UUID finder = register();
        UUID stranger = register();
        var lost = items.createLostItem(owner, item("Backpack"));
        var found = items.createFoundItem(finder, item("Black bag"));

        var claim = claims.submit(owner, found.getId(), SubmitClaimRequest.builder()
                .lostItemId(lost.getId()).identifyingDetails("Blue USB in front pocket").build());
        assertEquals(ItemStatus.CLAIM_PENDING, itemRepository.findById(found.getId()).orElseThrow().getStatus());
        assertThrows(AppException.class, () -> items.updateItem(finder, found.getId(), item("Changed bag")));
        assertThrows(AppException.class, () -> items.closeItem(finder, found.getId(), null));
        assertThrows(AppException.class, () -> claims.respond(stranger, claim.getId(),
                ClaimDecisionRequest.builder().decision(ClaimStatus.APPROVED).build()));

        claims.respond(finder, claim.getId(), ClaimDecisionRequest.builder()
                .decision(ClaimStatus.APPROVED).responseNote("Details match").build());
        var room = rooms.findByClaimId(claim.getId()).orElseThrow();
        assertEquals(1, chats.roomsFor(owner).size());
        assertEquals(1, chats.roomsFor(finder).size());
        assertEquals(0, chats.roomsFor(stranger).size());
        assertThrows(AppException.class, () -> chats.send(stranger, room.getId(),
                SendMessageRequest.builder().content("Hello").build()));
        assertEquals("Meet at library", chats.send(owner, room.getId(),
                SendMessageRequest.builder().content("Meet at library").build()).getContent());

        claims.proposeHandover(finder, claim.getId());
        assertThrows(AppException.class, () -> claims.confirmHandover(finder, claim.getId()));
        claims.confirmHandover(owner, claim.getId());
        assertEquals(ItemStatus.RETURNED, itemRepository.findById(found.getId()).orElseThrow().getStatus());
        assertEquals(ItemStatus.RETURNED, itemRepository.findById(lost.getId()).orElseThrow().getStatus());
        assertEquals(true, rooms.findByClaimId(claim.getId()).orElseThrow().isClosed());
    }

    @Test
    void finderCanRequestMoreInformationBeforeApproving() {
        UUID owner = register();
        UUID finder = register();
        var found = items.createFoundItem(finder, item("Keys"));
        var claim = claims.submit(owner, found.getId(), SubmitClaimRequest.builder()
                .identifyingDetails("Two keys on a ring").build());

        claims.respond(finder, claim.getId(), ClaimDecisionRequest.builder()
                .decision(ClaimStatus.REQUEST_MORE_INFO).responseNote("What is on the keychain?").build());
        assertThrows(AppException.class, () -> claims.addInfo(finder, claim.getId(),
                ClaimInfoRequest.builder().content("Not mine").build()));
        claims.addInfo(owner, claim.getId(), ClaimInfoRequest.builder().content("A red cat charm").build());
        assertEquals(2, claims.exchanges(owner, claim.getId()).size());
        claims.respond(finder, claim.getId(), ClaimDecisionRequest.builder()
                .decision(ClaimStatus.APPROVED).responseNote("Confirmed").build());
        assertEquals(ClaimStatus.APPROVED, claims.getForUser(owner, claim.getId()).getStatus());
    }

    private CreateItemRequest item(String name) {
        return CreateItemRequest.builder().itemName(name).eventDate(LocalDate.now()).build();
    }

    private UUID register() {
        return auth.register(RegisterRequest.builder().fullName("User")
                .email("claim-" + UUID.randomUUID() + "@example.com")
                .password("Password@123").build()).getUser().getId();
    }
}
