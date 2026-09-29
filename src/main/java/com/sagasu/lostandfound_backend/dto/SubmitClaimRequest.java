package com.sagasu.lostandfound_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitClaimRequest {
    private UUID lostItemId;
    @NotBlank
    private String identifyingDetails;
    private String evidenceImageUrl;
    private String contactPhone;
    private String contactEmail;
    private String note;
}
