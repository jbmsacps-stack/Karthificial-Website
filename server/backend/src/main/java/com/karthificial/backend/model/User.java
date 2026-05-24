package com.karthificial.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String studentClass;

    private String role = "STUDENT";

    public User() {
    }

    public User(String fullName, String email, String password, String studentClass) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.studentClass = studentClass;
    }

    public Long getId() {
        return id;
    }

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

    public String getRole() {
        return role;
    }
}