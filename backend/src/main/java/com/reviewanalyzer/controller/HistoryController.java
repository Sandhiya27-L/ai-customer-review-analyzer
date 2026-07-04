package com.reviewanalyzer.controller;

import com.reviewanalyzer.dto.AnalysisResponse;
import com.reviewanalyzer.dto.SaveAnalysisRequest;
import com.reviewanalyzer.service.ReviewAnalysisService;
import com.reviewanalyzer.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final ReviewAnalysisService reviewAnalysisService;

    @PostMapping
    public ResponseEntity<AnalysisResponse> save(@Valid @RequestBody SaveAnalysisRequest request) {
        AnalysisResponse saved = reviewAnalysisService.save(SecurityUtils.getCurrentUser(), request.getAnalysis());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<AnalysisResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return ResponseEntity.ok(reviewAnalysisService.getHistory(SecurityUtils.getCurrentUser(), search, from, to));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnalysisResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewAnalysisService.getById(SecurityUtils.getCurrentUser(), id));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<AnalysisResponse>> getRecent(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(reviewAnalysisService.getRecent(SecurityUtils.getCurrentUser(), limit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reviewAnalysisService.delete(SecurityUtils.getCurrentUser(), id);
        return ResponseEntity.noContent().build();
    }
}
