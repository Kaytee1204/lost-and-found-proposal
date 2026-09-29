package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.dto.CreateItemRequest;
import com.sagasu.lostandfound_backend.dto.CloseItemRequest;
import com.sagasu.lostandfound_backend.dto.ItemResponse;
import com.sagasu.lostandfound_backend.entity.ItemStatus;
import com.sagasu.lostandfound_backend.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.springframework.data.domain.PageRequest;

@SpringBootTest
@Transactional
class ItemServiceIntegrationTest {
    @Autowired AuthService authService;
    @Autowired ItemService itemService;

    @Test
    void ownerCanEditItemAndForeignUserCannot() {
        UUID owner = register();
        UUID other = register();
        ItemResponse created = itemService.createFoundItem(owner, CreateItemRequest.builder()
                .itemName("Black bag").eventDate(LocalDate.now()).imageUrl("https://cdn.example.com/one.png")
                .itemCondition("USED").build());
        assertEquals("USED", created.getItemCondition());

        CreateItemRequest edit = CreateItemRequest.builder()
                .itemName("Black backpack").eventDate(LocalDate.now())
                .imageUrl("https://cdn.example.com/two.png?version=2").build();
        assertThrows(AppException.class, () -> itemService.updateItem(other, created.getId(), edit));

        ItemResponse updated = itemService.updateItem(owner, created.getId(), edit);
        assertEquals("Black backpack", updated.getItemName());
        assertEquals("https://cdn.example.com/two.png?version=2", updated.getImageUrl());
        assertThrows(AppException.class, () -> itemService.updateItem(owner, created.getId(),
                CreateItemRequest.builder().itemName("Black backpack").eventDate(LocalDate.now())
                        .imageUrl("/api/v1/images/two.png").build()));
    }

    @Test
    void returnRequiresConfirmedHandoverAndClosedPostCannotBeEdited() {
        UUID owner = register();
        ItemResponse created = itemService.createFoundItem(owner, CreateItemRequest.builder()
                .itemName("Wallet").eventDate(LocalDate.now()).build());
        assertThrows(AppException.class, () -> itemService.closeItem(owner, created.getId(),
                CloseItemRequest.builder().status(ItemStatus.RETURNED).build()));

        itemService.closeItem(owner, created.getId(), CloseItemRequest.builder()
                .status(ItemStatus.CLOSED).build());
        assertThrows(AppException.class, () -> itemService.updateItem(owner, created.getId(),
                CreateItemRequest.builder().itemName("Wallet").eventDate(LocalDate.now()).build()));
    }

    @Test
    void textSearchFiltersProvinceAndDate() {
        UUID owner = register();
        itemService.createFoundItem(owner, CreateItemRequest.builder()
                .itemName("Blue wallet").eventDate(LocalDate.of(2026, 9, 20)).build());
        var results = itemService.getItems(null, ItemStatus.FOUND, null, "Blue wallet",
                null, LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30), PageRequest.of(0, 10));
        assertEquals(1, results.getContent().size());
        var outside = itemService.getItems(null, ItemStatus.FOUND, null, "Blue wallet",
                null, LocalDate.of(2026, 10, 1), null, PageRequest.of(0, 10));
        assertEquals(0, outside.getContent().size());
    }

    private UUID register() {
        return authService.register(RegisterRequest.builder()
                .fullName("Item User").email("item-" + UUID.randomUUID() + "@example.com")
                .password("Password@123").build()).getUser().getId();
    }
}
