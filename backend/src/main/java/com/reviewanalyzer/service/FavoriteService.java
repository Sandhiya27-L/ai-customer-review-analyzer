package com.reviewanalyzer.service;

import com.reviewanalyzer.dto.AnalysisResponse;
import com.reviewanalyzer.entity.Favorite;
import com.reviewanalyzer.entity.ReviewAnalysis;
import com.reviewanalyzer.entity.User;
import com.reviewanalyzer.exception.BadRequestException;
import com.reviewanalyzer.exception.ResourceNotFoundException;
import com.reviewanalyzer.repository.FavoriteRepository;
import com.reviewanalyzer.repository.ReviewAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ReviewAnalysisRepository reviewAnalysisRepository;
    private final ReviewAnalysisService reviewAnalysisService;

    @Transactional
    public AnalysisResponse addFavorite(User user, Long analysisId) {
        ReviewAnalysis analysis = reviewAnalysisRepository.findByIdAndUser(analysisId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found"));

        if (favoriteRepository.existsByUserAndAnalysisId(user, analysisId)) {
            throw new BadRequestException("Analysis is already in favorites");
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .analysis(analysis)
                .build();
        favoriteRepository.save(favorite);

        return reviewAnalysisService.mapToResponse(analysis, true);
    }

    @Transactional(readOnly = true)
    public List<AnalysisResponse> getFavorites(User user) {
        return favoriteRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(f -> {
                    AnalysisResponse response = reviewAnalysisService.mapToResponse(f.getAnalysis(), true);
                    response.setFavoriteId(f.getId());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeFavorite(User user, Long favoriteId) {
        Favorite favorite = favoriteRepository.findByIdAndUser(favoriteId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));
        favoriteRepository.delete(favorite);
    }
}
