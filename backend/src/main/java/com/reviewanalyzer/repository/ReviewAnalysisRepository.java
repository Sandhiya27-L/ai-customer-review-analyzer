package com.reviewanalyzer.repository;

import com.reviewanalyzer.entity.ReviewAnalysis;
import com.reviewanalyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReviewAnalysisRepository extends JpaRepository<ReviewAnalysis, Long> {

    List<ReviewAnalysis> findByUserOrderByCreatedAtDesc(User user);

    Optional<ReviewAnalysis> findByIdAndUser(Long id, User user);

    long countByUser(User user);

    @Query("SELECT r FROM ReviewAnalysis r WHERE r.user = :user " +
           "AND (:search IS NULL OR LOWER(r.summary) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(r.reviewText) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:from IS NULL OR r.createdAt >= :from) " +
           "AND (:to IS NULL OR r.createdAt <= :to) " +
           "ORDER BY r.createdAt DESC")
    List<ReviewAnalysis> searchByUser(
            @Param("user") User user,
            @Param("search") String search,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
