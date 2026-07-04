package com.reviewanalyzer.controller;

import com.reviewanalyzer.dto.AnalyzeRequest;
import com.reviewanalyzer.dto.AnalysisResponse;
import com.reviewanalyzer.service.ReviewAnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewAnalysisService reviewAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResponse> analyze(@Valid @RequestBody AnalyzeRequest request) {
        return ResponseEntity.ok(reviewAnalysisService.analyze(request.getReviewText()));
    }
}
