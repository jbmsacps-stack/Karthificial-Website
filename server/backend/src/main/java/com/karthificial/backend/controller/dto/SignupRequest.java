package com.karthificial.backend.dto;

public class SignupRequest {

    private String fullName;
    private String email;
    private String password;
    private String studentClass;

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getStudentClass() {
        return studentClass;
    }
}