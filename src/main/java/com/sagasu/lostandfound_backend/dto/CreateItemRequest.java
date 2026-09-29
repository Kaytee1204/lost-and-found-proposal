package com.sagasu.lostandfound_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateItemRequest {

    @NotBlank(message = "Tên đồ vật không được để trống")
    private String itemName;

    private String category;
    private String description;
    private String color;
    private String brand;
    private String size;
    private String material;
    private String itemCondition;
    private String provinceCode;
    private String wardCode;
    private String addressDetail;
    private Double lat;
    private Double lng;

    private String location;

    @NotNull(message = "Ngày xảy ra không được để trống")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate eventDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    private LocalTime eventTime;

    private String imageUrl;
    private String additionalCharacteristics;
    private String contactPhone;
}
