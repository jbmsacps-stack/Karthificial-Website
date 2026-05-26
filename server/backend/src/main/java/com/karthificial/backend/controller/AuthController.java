package com.karthificial.backend.controller;

import com.karthificial.backend.dto.AuthResponse;
import com.karthificial.backend.dto.LoginRequest;
import com.karthificial.backend.dto.SignupRequest;
import com.karthificial.backend.service.AuthService;
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

    public AuthController(AuthService authService) {
        this.authService = authService;
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
}
