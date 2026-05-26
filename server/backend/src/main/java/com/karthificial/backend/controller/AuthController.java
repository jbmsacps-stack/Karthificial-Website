package com.karthificial.backend.controller;

import com.karthificial.backend.dto.AuthResponse;
import com.karthificial.backend.dto.LoginRequest;
import com.karthificial.backend.dto.SignupRequest;
import com.karthificial.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Backend is running");
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse resp = authService.signup(request);
        if (!resp.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resp);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse resp = authService.login(request);
        if (!resp.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        }
        return ResponseEntity.ok(resp);
    }

    // Contact moderator flow — no email sending, no SMTP secrets required
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of(
                "message", "Password recovery is handled by moderators. Please contact the admin team with your registered email."
        ));
    }

    // Automatic reset disabled — direct users to moderators
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body(Map.of("message", "Automatic password reset is temporarily disabled. Please contact moderators."));
    }
}
