package com.karthificial.backend.controller;

import com.karthificial.backend.dto.AuthResponse;
import com.karthificial.backend.dto.LoginRequest;
import com.karthificial.backend.dto.SignupRequest;
import com.karthificial.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            Map<String, String> response = authService.signup(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException error) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", error.getMessage())
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException error) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", error.getMessage())
            );
        }
    }
}