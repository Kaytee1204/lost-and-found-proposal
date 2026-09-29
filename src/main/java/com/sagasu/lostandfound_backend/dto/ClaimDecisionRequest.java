package com.sagasu.lostandfound_backend.dto;

import com.sagasu.lostandfound_backend.entity.ClaimStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimDecisionRequest {
    @NotNull
    private ClaimStatus decision;
    private String responseNote;
}
