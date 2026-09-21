package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.api.PageResponse;
import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.common.exception.ErrorCode;
import com.sagasu.lostandfound_backend.dto.CloseItemRequest;
import com.sagasu.lostandfound_backend.dto.CreateItemRequest;
import com.sagasu.lostandfound_backend.dto.ItemResponse;
import com.sagasu.lostandfound_backend.entity.Item;
import com.sagasu.lostandfound_backend.entity.ItemStatus;
import com.sagasu.lostandfound_backend.entity.ItemType;
import com.sagasu.lostandfound_backend.entity.User;
import com.sagasu.lostandfound_backend.repository.ItemRepository;
import com.sagasu.lostandfound_backend.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @Transactional
    public ItemResponse createLostItem(UUID userId, CreateItemRequest request) {
        return createItem(userId, request, ItemType.LOST, ItemStatus.LOST);
    }

    @Transactional
    public ItemResponse createFoundItem(UUID userId, CreateItemRequest request) {
        return createItem(userId, request, ItemType.FOUND, ItemStatus.FOUND);
    }

    private ItemResponse createItem(UUID userId, CreateItemRequest request, ItemType type, ItemStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Item item = Item.builder()
                .user(user)
                .itemType(type)
                .itemName(request.getItemName())
                .category(request.getCategory())
                .description(request.getDescription())
                .color(request.getColor())
                .brand(request.getBrand())
                .size(request.getSize())
                .material(request.getMaterial())
                .location(request.getLocation())
                .eventDate(request.getEventDate())
                .eventTime(request.getEventTime())
                .imageUrl(request.getImageUrl())
                .additionalCharacteristics(request.getAdditionalCharacteristics())
                .contactPhone(request.getContactPhone() != null ? request.getContactPhone() : user.getPhone())
                .status(status)
                .build();

        Item saved = itemRepository.save(item);
        return ItemResponse.from(saved);
    }

    public ItemResponse getItemById(UUID id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
        return ItemResponse.from(item);
    }

    public PageResponse<ItemResponse> getItems(
            ItemType itemType,
            ItemStatus status,
            String category,
            String keyword,
            Pageable pageable
    ) {
        Specification<Item> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (itemType != null) {
                predicates.add(cb.equal(root.get("itemType"), itemType));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.toLowerCase().trim()));
            }
            if (keyword != null && !keyword.isBlank()) {
                String likePattern = "%" + keyword.toLowerCase().trim() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("itemName")), likePattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), likePattern);
                Predicate locMatch = cb.like(cb.lower(root.get("location")), likePattern);
                predicates.add(cb.or(nameMatch, descMatch, locMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<ItemResponse> page = itemRepository.findAll(spec, pageable).map(ItemResponse::from);
        return PageResponse.from(page);
    }

    public PageResponse<ItemResponse> getMyItems(UUID userId, Pageable pageable) {
        Page<ItemResponse> page = itemRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(ItemResponse::from);
        return PageResponse.from(page);
    }

    @Transactional
    public ItemResponse closeItem(UUID userId, UUID itemId, CloseItemRequest request) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        if (!item.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.FORBIDDEN, "Chỉ chủ bài đăng mới có thể cập nhật trạng thái này");
        }

        ItemStatus targetStatus = (request != null && request.getStatus() != null)
                ? request.getStatus()
                : ItemStatus.RETURNED;

        item.setStatus(targetStatus);
        Item updated = itemRepository.save(item);
        return ItemResponse.from(updated);
    }
}
