package com.reviewanalyzer.service;

import com.reviewanalyzer.dto.ChangePasswordRequest;
import com.reviewanalyzer.dto.ProfileResponse;
import com.reviewanalyzer.dto.UpdateProfileRequest;
import com.reviewanalyzer.entity.User;
import com.reviewanalyzer.exception.BadRequestException;
import com.reviewanalyzer.exception.ResourceNotFoundException;
import com.reviewanalyzer.repository.ReviewAnalysisRepository;
import com.reviewanalyzer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ReviewAnalysisRepository reviewAnalysisRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(User user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .joinedDate(user.getCreatedAt())
                .totalAnalyses(reviewAnalysisRepository.countByUser(user))
                .build();
    }

    @Transactional
    public ProfileResponse updateProfile(User user, UpdateProfileRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already in use");
        }
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        User saved = userRepository.save(user);
        return getProfile(saved);
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(User user) {
        User managed = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(managed);
    }
}
