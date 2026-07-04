package com.reviewanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {
    private Long id;
    private String reviewText;
    private Integer wordCount;
    private Integer charCount;
    private String summary;
    private List<String> positivePoints;
    private List<String> negativePoints;
    private List<String> complaints;
    private List<String> features;
    private List<String> keywords;
    private List<String> suggestions;
    private SentimentDto sentiment;
    private LocalDateTime createdAt;
    private boolean favorite;
    private Long favoriteId;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SentimentDto {
        private int positive;
        private int neutral;
        private int negative;
    }
}
