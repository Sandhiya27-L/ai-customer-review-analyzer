package com.reviewanalyzer.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reviewanalyzer.dto.AnalysisResponse;
import com.reviewanalyzer.entity.ReviewAnalysis;
import com.reviewanalyzer.entity.User;
import com.reviewanalyzer.exception.BadRequestException;
import com.reviewanalyzer.exception.ResourceNotFoundException;
import com.reviewanalyzer.repository.FavoriteRepository;
import com.reviewanalyzer.repository.ReviewAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewAnalysisService {

    private final ReviewAnalysisRepository reviewAnalysisRepository;
    private final FavoriteRepository favoriteRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public AnalysisResponse analyze(String reviewText) {
        return geminiService.analyzeReviews(reviewText);
    }

    @Transactional
    public AnalysisResponse save(User user, AnalysisResponse analysis) {
        ReviewAnalysis entity = mapToEntity(user, analysis);
        ReviewAnalysis saved = reviewAnalysisRepository.save(entity);
        return mapToResponse(saved, false);
    }

    @Transactional(readOnly = true)
    public List<AnalysisResponse> getHistory(User user, String search, LocalDateTime from, LocalDateTime to) {
        String searchTerm = (search != null && !search.isBlank()) ? search.trim() : null;
        return reviewAnalysisRepository.searchByUser(user, searchTerm, from, to).stream()
                .map(entity -> mapToResponse(entity, favoriteRepository.existsByUserAndAnalysisId(user, entity.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnalysisResponse getById(User user, Long id) {
        ReviewAnalysis entity = reviewAnalysisRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found"));
        return mapToResponse(entity, favoriteRepository.existsByUserAndAnalysisId(user, entity.getId()));
    }

    @Transactional
    public void delete(User user, Long id) {
        ReviewAnalysis entity = reviewAnalysisRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found"));
        reviewAnalysisRepository.delete(entity);
    }

    @Transactional(readOnly = true)
    public long countByUser(User user) {
        return reviewAnalysisRepository.countByUser(user);
    }

    @Transactional(readOnly = true)
    public List<AnalysisResponse> getRecent(User user, int limit) {
        return reviewAnalysisRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .limit(limit)
                .map(entity -> mapToResponse(entity, favoriteRepository.existsByUserAndAnalysisId(user, entity.getId())))
                .collect(Collectors.toList());
    }

    private ReviewAnalysis mapToEntity(User user, AnalysisResponse analysis) {
        return ReviewAnalysis.builder()
                .user(user)
                .reviewText(analysis.getReviewText())
                .wordCount(analysis.getWordCount())
                .charCount(analysis.getCharCount())
                .summary(analysis.getSummary())
                .positivePoints(toJson(analysis.getPositivePoints()))
                .negativePoints(toJson(analysis.getNegativePoints()))
                .complaints(toJson(analysis.getComplaints()))
                .features(toJson(analysis.getFeatures()))
                .keywords(toJson(analysis.getKeywords()))
                .suggestions(toJson(analysis.getSuggestions()))
                .sentimentPositive(analysis.getSentiment().getPositive())
                .sentimentNeutral(analysis.getSentiment().getNeutral())
                .sentimentNegative(analysis.getSentiment().getNegative())
                .build();
    }

    public AnalysisResponse mapToResponse(ReviewAnalysis entity, boolean favorite) {
        return AnalysisResponse.builder()
                .id(entity.getId())
                .reviewText(entity.getReviewText())
                .wordCount(entity.getWordCount())
                .charCount(entity.getCharCount())
                .summary(entity.getSummary())
                .positivePoints(fromJson(entity.getPositivePoints()))
                .negativePoints(fromJson(entity.getNegativePoints()))
                .complaints(fromJson(entity.getComplaints()))
                .features(fromJson(entity.getFeatures()))
                .keywords(fromJson(entity.getKeywords()))
                .suggestions(fromJson(entity.getSuggestions()))
                .sentiment(AnalysisResponse.SentimentDto.builder()
                        .positive(entity.getSentimentPositive())
                        .neutral(entity.getSentimentNeutral())
                        .negative(entity.getSentimentNegative())
                        .build())
                .createdAt(entity.getCreatedAt())
                .favorite(favorite)
                .build();
    }

    private String toJson(List<String> values) {
        try {
            return objectMapper.writeValueAsString(values != null ? values : Collections.emptyList());
        } catch (JsonProcessingException e) {
            throw new BadRequestException("Failed to serialize analysis data");
        }
    }

    private List<String> fromJson(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }
}
