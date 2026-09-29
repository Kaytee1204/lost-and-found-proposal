package com.sagasu.lostandfound_backend.dto;

import com.sagasu.lostandfound_backend.entity.ItemStatus;
import com.sagasu.lostandfound_backend.entity.ItemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TextSearchRequest {
    private String keyword;
    private ItemType type;
    private ItemStatus status;
    private String category;
    private String provinceCode;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Integer page;
    private Integer size;
}
