package com.reviewanalyzer.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SaveAnalysisRequest {

    @NotNull(message = "Analysis data is required")
    private AnalysisResponse analysis;
}
