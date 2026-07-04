package com.reviewanalyzer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AnalyzeRequest {

    @NotBlank(message = "Review text is required")
    @Size(min = 10, message = "Please provide at least 10 characters of review text")
    private String reviewText;
}
