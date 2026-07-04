package com.reviewanalyzer.controller;

import com.reviewanalyzer.dto.AnalysisResponse;
import com.reviewanalyzer.dto.FavoriteRequest;
import com.reviewanalyzer.service.FavoriteService;
import com.reviewanalyzer.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<AnalysisResponse> add(@Valid @RequestBody FavoriteRequest request) {
        AnalysisResponse response = favoriteService.addFavorite(SecurityUtils.getCurrentUser(), request.getAnalysisId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AnalysisResponse>> list() {
        return ResponseEntity.ok(favoriteService.getFavorites(SecurityUtils.getCurrentUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        favoriteService.removeFavorite(SecurityUtils.getCurrentUser(), id);
        return ResponseEntity.noContent().build();
    }
}
