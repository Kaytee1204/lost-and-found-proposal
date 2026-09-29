package com.sagasu.lostandfound_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitReportRequest {
    @NotBlank
    private String targetType;
    @NotNull
    private UUID targetId;
    @NotBlank
    private String reason;
    private String description;
    private String evidenceImageUrl;
}
