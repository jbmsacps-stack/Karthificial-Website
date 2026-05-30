package com.karthificial.backend.controller;

import com.karthificial.backend.dto.McqSubmitRequest;
import com.karthificial.backend.dto.McqSubmitResponse;
import com.karthificial.backend.model.McqAttempt;
import com.karthificial.backend.repository.McqAttemptRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mcq")
public class McqController {

    private final McqAttemptRepository mcqAttemptRepository;

    public McqController(McqAttemptRepository mcqAttemptRepository) {
        this.mcqAttemptRepository = mcqAttemptRepository;
    }

    @PostMapping("/submit")
    public McqSubmitResponse submitMcq(@Valid @RequestBody McqSubmitRequest request) {

        McqAttempt attempt = new McqAttempt();
        attempt.setMcqSet(request.getMcqSet());
        attempt.setScore(request.getScore());
        attempt.setCorrectCount(request.getCorrectCount());
        attempt.setWrongCount(request.getWrongCount());
        attempt.setTimeTakenSeconds(request.getTimeTakenSeconds());

        mcqAttemptRepository.save(attempt);

        long completedCount = mcqAttemptRepository.countByMcqSet(request.getMcqSet());

        return new McqSubmitResponse(
                true,
                "MCQ attempt saved successfully",
                completedCount
        );
    }

    @GetMapping("/stats/{mcqSet}")
    public Map<String, Object> getStats(@PathVariable String mcqSet) {
        long completedCount = mcqAttemptRepository.countByMcqSet(mcqSet);

        return Map.of(
                "success", true,
                "mcqSet", mcqSet,
                "completedCount", completedCount
        );
    }
}
