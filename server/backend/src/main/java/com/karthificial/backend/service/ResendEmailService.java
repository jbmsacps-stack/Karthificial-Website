package com.karthificial.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class ResendEmailService {

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    public void sendResetPasswordEmail(String toEmail, String resetLink) {
        String url = "https://api.resend.com/emails";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        final var resendApiKey2 = resendApiKey;
        if (resendApiKey2 != null) {
            headers.setBearerAuth(resendApiKey2);
        } else {
            // TODO handle null value
        }
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "from", "Karthificial <onboarding@resend.dev>",
                "to", List.of(toEmail),
                "subject", "Reset your password",
                "html", """
                        <h2>Reset Your Password</h2>
                        <p>Click the link below to reset your password:</p>
                        <a href="%s">Reset Password</a>
                        <p>This link will expire soon.</p>
                        """.formatted(resetLink)
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        restTemplate.postForEntity(url, request, String.class);
    }
}