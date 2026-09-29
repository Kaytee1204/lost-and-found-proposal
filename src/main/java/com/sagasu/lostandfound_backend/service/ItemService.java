package com.sagasu.lostandfound_backend.service;

import com.sagasu.lostandfound_backend.common.api.PageResponse;
import com.sagasu.lostandfound_backend.common.exception.AppException;
import com.sagasu.lostandfound_backend.common.exception.ErrorCode;
import com.sagasu.lostandfound_backend.common.util.ImageLink;
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
import java.time.LocalDate;
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
        validateLocation(request);
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
                .itemCondition(type == ItemType.FOUND ? request.getItemCondition() : null)
                .provinceCode(request.getProvinceCode())
                .wardCode(request.getWardCode())
                .addressDetail(request.getAddressDetail())
                .lat(request.getLat())
                .lng(request.getLng())
                .coordinateSource(request.getLat() == null ? null : "PIN")
                .location(request.getLocation())
                .eventDate(request.getEventDate())
                .eventTime(request.getEventTime())
                .imageUrl(ImageLink.validate(request.getImageUrl()))
                .additionalCharacteristics(request.getAdditionalCharacteristics())
                .contactPhone(request.getContactPhone() != null ? request.getContactPhone() : user.getPhone())
                .status(status)
                .build();

        return ItemResponse.from(itemRepository.save(item));
    }

    @Transactional
    public ItemResponse updateItem(UUID userId, UUID itemId, CreateItemRequest request) {
        validateLocation(request);
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
        if (!item.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        if (item.getStatus() == ItemStatus.CLOSED || item.getStatus() == ItemStatus.RETURNED
                || item.getStatus() == ItemStatus.CLAIM_PENDING || item.getStatus() == ItemStatus.IN_DISCUSSION) {
            throw new AppException(ErrorCode.INVALID_STATE_TRANSITION);
        }
        item.setItemName(request.getItemName());
        item.setCategory(request.getCategory());
        item.setDescription(request.getDescription());
        item.setColor(request.getColor());
        item.setBrand(request.getBrand());
        item.setSize(request.getSize());
        item.setMaterial(request.getMaterial());
        item.setItemCondition(item.getItemType() == ItemType.FOUND ? request.getItemCondition() : null);
        item.setLocation(request.getLocation());
        item.setProvinceCode(request.getProvinceCode());
        item.setWardCode(request.getWardCode());
        item.setAddressDetail(request.getAddressDetail());
        item.setLat(request.getLat());
        item.setLng(request.getLng());
        item.setCoordinateSource(request.getLat() == null ? null : "PIN");
        item.setEventDate(request.getEventDate());
        item.setEventTime(request.getEventTime());
        item.setImageUrl(ImageLink.validate(request.getImageUrl()));
        item.setAdditionalCharacteristics(request.getAdditionalCharacteristics());
        item.setContactPhone(request.getContactPhone());
        return ItemResponse.from(itemRepository.save(item));
    }

    private void validateLocation(CreateItemRequest request) {
        if ((request.getLat() == null) != (request.getLng() == null)) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Latitude and longitude must be provided together");
        }
        if (request.getLat() != null && (request.getLat() < -90 || request.getLat() > 90
                || request.getLng() < -180 || request.getLng() > 180)) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Invalid coordinates");
        }
        if (request.getWardCode() != null && request.getProvinceCode() == null) {
            throw new AppException(ErrorCode.BAD_REQUEST, "A ward requires a province");
        }
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
            String provinceCode,
            LocalDate fromDate,
            LocalDate toDate,
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
            if (provinceCode != null && !provinceCode.isBlank()) {
                predicates.add(cb.equal(root.get("provinceCode"), provinceCode.trim()));
            }
            if (fromDate != null) predicates.add(cb.greaterThanOrEqualTo(root.get("eventDate"), fromDate));
            if (toDate != null) predicates.add(cb.lessThanOrEqualTo(root.get("eventDate"), toDate));
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
                : ItemStatus.CLOSED;

        if (targetStatus != ItemStatus.CLOSED || item.getStatus() == ItemStatus.CLOSED
                || item.getStatus() == ItemStatus.RETURNED || item.getStatus() == ItemStatus.CLAIM_PENDING
                || item.getStatus() == ItemStatus.IN_DISCUSSION) {
            throw new AppException(ErrorCode.INVALID_STATE_TRANSITION);
        }

        item.setStatus(targetStatus);
        Item updated = itemRepository.save(item);
        return ItemResponse.from(updated);
    }
}
