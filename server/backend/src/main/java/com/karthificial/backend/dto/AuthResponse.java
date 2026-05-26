package com.karthificial.backend.dto;

public class AuthResponse {

    private boolean success;
    private String message;
    private Long userId;
    private String fullName;
    private String email;
    private String studentClass;
    private String token;

    public AuthResponse(boolean success, String message, Long userId, String fullName, String email, String studentClass) {
        this(success, message, userId, fullName, email, studentClass, null);
    }

    public AuthResponse(boolean success, String message, Long userId, String fullName, String email, String studentClass, String token) {
        this.success = success;
        this.message = message;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.studentClass = studentClass;
        this.token = token;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getStudentClass() {
        return studentClass;
    }

    public String getToken() {
        return token;
    }
}
