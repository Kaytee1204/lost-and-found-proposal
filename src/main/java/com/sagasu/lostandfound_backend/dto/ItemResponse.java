package com.sagasu.lostandfound_backend.dto;

import com.sagasu.lostandfound_backend.dto.UserResponse;
import com.sagasu.lostandfound_backend.entity.Item;
import com.sagasu.lostandfound_backend.entity.ItemStatus;
import com.sagasu.lostandfound_backend.entity.ItemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponse {
    private UUID id;
    private UserResponse user;
    private ItemType itemType;
    private String itemName;
    private String category;
    private String description;
    private String color;
    private String brand;
    private String size;
    private String material;
    private String location;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String imageUrl;
    private String additionalCharacteristics;
    private String contactPhone;
    private ItemStatus status;
    private Instant createdAt;
    private Instant updatedAt;

    public static ItemResponse from(Item item) {
        if (item == null) return null;
        return ItemResponse.builder()
                .id(item.getId())
                .user(UserResponse.from(item.getUser()))
                .itemType(item.getItemType())
                .itemName(item.getItemName())
                .category(item.getCategory())
                .description(item.getDescription())
                .color(item.getColor())
                .brand(item.getBrand())
                .size(item.getSize())
                .material(item.getMaterial())
                .location(item.getLocation())
                .eventDate(item.getEventDate())
                .eventTime(item.getEventTime())
                .imageUrl(item.getImageUrl())
                .additionalCharacteristics(item.getAdditionalCharacteristics())
                .contactPhone(item.getContactPhone())
                .status(item.getStatus())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
