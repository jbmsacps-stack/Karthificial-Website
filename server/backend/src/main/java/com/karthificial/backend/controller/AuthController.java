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
    public AuthResponse signup(@Valid @RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/health")
    public String health() {
        return "Backend is running";
    }
}
