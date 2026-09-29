package com.sagasu.lostandfound_backend.dto;

import com.sagasu.lostandfound_backend.entity.ItemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CloseItemRequest {
    @Builder.Default
    private ItemStatus status = ItemStatus.CLOSED;
    private String reason;
}
