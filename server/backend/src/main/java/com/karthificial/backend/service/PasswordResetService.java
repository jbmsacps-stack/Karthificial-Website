package com.karthificial.backend.service;

import org.springframework.stereotype.Service;

/**
 * Password reset is temporarily disabled.
 * Kept as a stub so it compiles cleanly.
 * Re-enable by restoring full implementation once email is configured.
 */
@Service
public class PasswordResetService {

    public void createAndSendResetToken(String email) {
        System.out.println("[PasswordResetService] Disabled — ignoring reset request for: " + email);
    }

    public boolean resetPassword(String token, String newPassword) {
        System.out.println("[PasswordResetService] Disabled — ignoring reset attempt.");
        return false;
    }
}
