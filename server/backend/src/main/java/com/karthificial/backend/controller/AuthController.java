package com.karthificial.backend.controller;

import com.karthificial.backend.dto.AuthResponse;
import com.karthificial.backend.dto.LoginRequest;
import com.karthificial.backend.dto.SignupRequest;
import com.karthificial.backend.service.AuthService;
import com.karthificial.backend.service.PasswordResetService;
import java.util.Map;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {
    "http://127.0.0.1:3000",
    "http://localhost:3000"
})
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/signup")
    public org.springframework.http.ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse resp = authService.signup(request);

        if (!resp.isSuccess()) {
            // Conflict when email exists
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.CONFLICT).body(resp);
        }

        return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(resp);
    }

    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse resp = authService.login(request);

        if (!resp.isSuccess()) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body(resp);
        }

        return org.springframework.http.ResponseEntity.ok(resp);
    }

    @GetMapping("/health")
    public String health() {
        return "Backend is running";
    }

    @PostMapping("/forgot-password")
    public org.springframework.http.ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "");

        // Always respond with the same message to prevent email enumeration
        passwordResetService.createAndSendResetToken(email);

        return org.springframework.http.ResponseEntity.ok(Map.of("message", "If this email exists, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public org.springframework.http.ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.getOrDefault("token", "");
        String newPassword = body.getOrDefault("newPassword", "");

        if (token.isBlank() || newPassword.isBlank()) {
            return org.springframework.http.ResponseEntity.badRequest().body(Map.of("message", "Invalid request."));
        }

        boolean ok = passwordResetService.resetPassword(token, newPassword);

        if (!ok) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid or expired token."));
        }

        return org.springframework.http.ResponseEntity.ok(Map.of("message", "Password has been reset successfully."));
    }
}
