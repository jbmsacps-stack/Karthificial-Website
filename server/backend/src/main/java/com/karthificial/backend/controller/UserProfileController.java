package com.karthificial.backend.controller;

import com.karthificial.backend.dto.UserProfileRequest;
import com.karthificial.backend.model.UserProfile;
import com.karthificial.backend.repository.UserProfileRepository;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserProfileController {

    private final UserProfileRepository userProfileRepository;

    public UserProfileController(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @PostMapping("/sync")
    public Map<String, Object> syncUserProfile(@RequestBody UserProfileRequest request) {

        UserProfile profile = userProfileRepository
                .findByClerkUserId(request.getClerkUserId())
                .orElseGet(UserProfile::new);

        boolean isNewUser = profile.getClerkUserId() == null;

        profile.setClerkUserId(request.getClerkUserId());
        profile.setDisplayName(request.getDisplayName());
        profile.setEmail(request.getEmail());

        if (isNewUser) {
            profile.setCreatedAt(OffsetDateTime.now());
        }

        profile.setUpdatedAt(OffsetDateTime.now());

        UserProfile savedProfile = userProfileRepository.save(profile);

        return Map.of(
                "id", savedProfile.getId(),
                "clerkUserId", savedProfile.getClerkUserId(),
                "displayName", savedProfile.getDisplayName(),
                "email", savedProfile.getEmail()
        );
    }

    @GetMapping("/{clerkUserId}")
    public Map<String, Object> getUserProfile(@PathVariable String clerkUserId) {

        UserProfile profile = userProfileRepository
                .findByClerkUserId(clerkUserId)
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        return Map.of(
                "id", profile.getId(),
                "clerkUserId", profile.getClerkUserId(),
                "displayName", profile.getDisplayName(),
                "email", profile.getEmail()
        );
    }
}