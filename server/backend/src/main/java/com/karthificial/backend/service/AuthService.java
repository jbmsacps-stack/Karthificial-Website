package com.karthificial.backend.service;

import com.karthificial.backend.dto.AuthResponse;
import com.karthificial.backend.dto.LoginRequest;
import com.karthificial.backend.dto.SignupRequest;
import com.karthificial.backend.model.User;
import com.karthificial.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public AuthResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            System.out.println("[AuthService] Signup attempt with existing email: " + request.getEmail());
            return new AuthResponse(false, "Email already exists", null, null, null, null);
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStudentClass(request.getStudentClass());

        User savedUser = userRepository.save(user);

        System.out.println("[AuthService] New user created: " + savedUser.getEmail());

        return new AuthResponse(
            true,
            "Account created successfully",
            savedUser.getId(),
            savedUser.getFullName(),
            savedUser.getEmail(),
            savedUser.getStudentClass()
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            System.out.println("[AuthService] Login failed - user not found: " + request.getEmail());
            return new AuthResponse(false, "Invalid email or password", null, null, null, null);
        }

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!passwordMatches) {
            System.out.println("[AuthService] Login failed - wrong password for: " + request.getEmail());
            return new AuthResponse(false, "Invalid email or password", null, null, null, null);
        }

        // Generate JWT only on successful authentication
        String token = jwtService.generateToken(user);
        System.out.println("[AuthService] Login successful for " + user.getEmail());

        return new AuthResponse(
            true,
            "Login successful",
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getStudentClass(),
            token
        );
    }
}
