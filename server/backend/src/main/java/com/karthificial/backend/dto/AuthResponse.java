package com.karthificial.backend.dto;

public class AuthResponse {

    private boolean success;
    private String message;
    private Long userId;
    private String fullName;
    private String email;
    private String studentClass;

    public AuthResponse(boolean success, String message, Long userId, String fullName, String email, String studentClass) {
        this.success = success;
        this.message = message;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.studentClass = studentClass;
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
}
