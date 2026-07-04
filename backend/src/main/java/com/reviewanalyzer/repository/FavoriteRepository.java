package com.reviewanalyzer.repository;

import com.reviewanalyzer.entity.Favorite;
import com.reviewanalyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    @Query("SELECT f FROM Favorite f JOIN FETCH f.analysis WHERE f.user = :user ORDER BY f.createdAt DESC")
    List<Favorite> findByUserOrderByCreatedAtDesc(@Param("user") User user);

    Optional<Favorite> findByIdAndUser(Long id, User user);
    Optional<Favorite> findByUserAndAnalysisId(User user, Long analysisId);
    boolean existsByUserAndAnalysisId(User user, Long analysisId);
}
