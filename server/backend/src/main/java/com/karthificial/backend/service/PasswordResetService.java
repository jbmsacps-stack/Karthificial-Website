package com.karthificial.backend.service;

import com.karthificial.backend.model.PasswordResetToken;
import com.karthificial.backend.model.User;
import com.karthificial.backend.repository.PasswordResetTokenRepository;
import com.karthificial.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final String frontendUrl;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public PasswordResetService(PasswordResetTokenRepository tokenRepository,
                                UserRepository userRepository,
                                EmailService emailService,
                                @Value("${app.frontend-url:http://localhost:3000}") String frontendUrl) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.frontendUrl = frontendUrl;
    }

    public void createAndSendResetToken(String email) {
        Optional<User> maybeUser = userRepository.findByEmail(email);

        // Always behave the same to avoid user enumeration
        if (maybeUser.isEmpty()) {
            return;
        }

        User user = maybeUser.get();

        // Generate secure random token
        byte[] rnd = new byte[32];
        new SecureRandom().nextBytes(rnd);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(rnd);

        PasswordResetToken prt = new PasswordResetToken();
        prt.setToken(token);
        prt.setUser(user);
        prt.setExpiryTime(LocalDateTime.now().plusMinutes(15));
        prt.setUsed(false);

        tokenRepository.save(prt);

        String resetLink = frontendUrl + "/reset-password.html?token=" + token;

        String subject = "Password reset for your account";
        String body = "Click the link to reset your password:\n" + resetLink + "\nThis link expires in 15 minutes.";

        try {
            emailService.sendSimpleMessage(user.getEmail(), subject, body);
        } catch (Exception e) {
            System.out.println("[PasswordResetService] Failed to send reset email: " + e.getMessage());
        }
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> maybe = tokenRepository.findByToken(token);

        if (maybe.isEmpty()) return false;

        PasswordResetToken prt = maybe.get();

        if (prt.isUsed()) return false;

        if (prt.getExpiryTime().isBefore(LocalDateTime.now())) return false;

        User user = prt.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        prt.setUsed(true);
        tokenRepository.save(prt);

        return true;
    }
}
