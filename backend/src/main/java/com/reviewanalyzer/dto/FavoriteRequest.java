package com.reviewanalyzer.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FavoriteRequest {

    @NotNull(message = "Analysis ID is required")
    private Long analysisId;
}
