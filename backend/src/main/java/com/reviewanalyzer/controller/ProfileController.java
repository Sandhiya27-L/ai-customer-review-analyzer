package com.reviewanalyzer.controller;

import com.reviewanalyzer.dto.ChangePasswordRequest;
import com.reviewanalyzer.dto.ProfileResponse;
import com.reviewanalyzer.dto.UpdateProfileRequest;
import com.reviewanalyzer.service.UserService;
import com.reviewanalyzer.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile() {
        return ResponseEntity.ok(userService.getProfile(SecurityUtils.getCurrentUser()));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(SecurityUtils.getCurrentUser(), request));
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(SecurityUtils.getCurrentUser(), request);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> deleteAccount() {
        userService.deleteAccount(SecurityUtils.getCurrentUser());
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }
}
