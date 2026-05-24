package com.karthificial.backend.dto;

public class McqSubmitResponse {

    private boolean success;
    private String message;
    private long completedCount;

    public McqSubmitResponse(boolean success, String message, long completedCount) {
        this.success = success;
        this.message = message;
        this.completedCount = completedCount;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public long getCompletedCount() {
        return completedCount;
    }
}
