package com.karthificial.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class McqSubmitRequest {

    @NotBlank
    private String mcqSet;

    @NotNull
    private Integer score;

    @NotNull
    private Integer correctCount;

    @NotNull
    private Integer wrongCount;

    @NotNull
    private Integer timeTakenSeconds;

    public String getMcqSet() {
        return mcqSet;
    }

    public void setMcqSet(String mcqSet) {
        this.mcqSet = mcqSet;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(Integer correctCount) {
        this.correctCount = correctCount;
    }

    public Integer getWrongCount() {
        return wrongCount;
    }

    public void setWrongCount(Integer wrongCount) {
        this.wrongCount = wrongCount;
    }

    public Integer getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(Integer timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }
}
