package com.reviewanalyzer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "review_analysis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "review_text", nullable = false, columnDefinition = "TEXT")
    private String reviewText;

    @Column(name = "word_count", nullable = false)
    private Integer wordCount;

    @Column(name = "char_count", nullable = false)
    private Integer charCount;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "positive_points", columnDefinition = "JSON")
    private String positivePoints;

    @Column(name = "negative_points", columnDefinition = "JSON")
    private String negativePoints;

    @Column(columnDefinition = "JSON")
    private String complaints;

    @Column(columnDefinition = "JSON")
    private String features;

    @Column(columnDefinition = "JSON")
    private String keywords;

    @Column(columnDefinition = "JSON")
    private String suggestions;

    @Column(name = "sentiment_positive", nullable = false)
    private Integer sentimentPositive;

    @Column(name = "sentiment_neutral", nullable = false)
    private Integer sentimentNeutral;

    @Column(name = "sentiment_negative", nullable = false)
    private Integer sentimentNegative;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
