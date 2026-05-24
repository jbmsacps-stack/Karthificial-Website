package com.karthificial.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mcq_attempts")
public class McqAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mcq_set", nullable = false)
    private String mcqSet;

    @Column(nullable = false)
    private int score;

    @Column(name = "correct_count", nullable = false)
    private int correctCount;

    @Column(name = "wrong_count", nullable = false)
    private int wrongCount;

    @Column(name = "time_taken_seconds", nullable = false)
    private int timeTakenSeconds;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public String getMcqSet() {
        return mcqSet;
    }

    public void setMcqSet(String mcqSet) {
        this.mcqSet = mcqSet;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(int correctCount) {
        this.correctCount = correctCount;
    }

    public int getWrongCount() {
        return wrongCount;
    }

    public void setWrongCount(int wrongCount) {
        this.wrongCount = wrongCount;
    }

    public int getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(int timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
