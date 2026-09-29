package com.sagasu.lostandfound_backend.entity;

import com.sagasu.lostandfound_backend.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private ItemType itemType;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String color;

    private String brand;

    private String size;

    private String material;

    @Column(name = "item_condition")
    private String itemCondition;

    @Column(name = "province_code")
    private String provinceCode;

    @Column(name = "ward_code")
    private String wardCode;

    @Column(name = "address_detail")
    private String addressDetail;

    private Double lat;
    private Double lng;

    @Column(name = "coordinate_source")
    private String coordinateSource;

    @Column(name = "location")
    private String location;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "event_time")
    private LocalTime eventTime;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "additional_characteristics", columnDefinition = "TEXT")
    private String additionalCharacteristics;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
