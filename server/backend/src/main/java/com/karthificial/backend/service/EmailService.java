package com.karthificial.backend.service;

import org.springframework.stereotype.Service;

/**
 * Email sending is temporarily disabled.
 * This stub exists so PasswordResetService compiles without breaking the build.
 * Re-enable by adding spring-boot-starter-mail to pom.xml and configuring SMTP secrets.
 */
@Service
public class EmailService {

    public void sendSimpleMessage(String to, String subject, String text) {
        System.out.println("[EmailService] Email sending is disabled. Would have sent to: " + to);
    }
}
