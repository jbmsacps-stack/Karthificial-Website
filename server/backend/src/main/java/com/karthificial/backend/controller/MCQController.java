package com.karthificial.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/mcq")
@CrossOrigin(origins = "*")
public class MCQController {

    @GetMapping
    public List<Map<String, Object>> getMCQQuestions() {

        List<Map<String, Object>> questions = new ArrayList<>();

        Map<String, Object> q1 = new HashMap<>();
        q1.put("question", "What is HTML?");
        q1.put("options", Arrays.asList(
                "Programming Language",
                "Markup Language",
                "Database",
                "Operating System"
        ));
        q1.put("answer", "Markup Language");

        Map<String, Object> q2 = new HashMap<>();
        q2.put("question", "Which language is used for styling?");
        q2.put("options", Arrays.asList(
                "Java",
                "Python",
                "CSS",
                "C++"
        ));
        q2.put("answer", "CSS");

        Map<String, Object> q3 = new HashMap<>();
        q3.put("question", "Which is used for backend?");
        q3.put("options", Arrays.asList(
                "Spring Boot",
                "HTML",
                "CSS",
                "Photoshop"
        ));
        q3.put("answer", "Spring Boot");

        questions.add(q1);
        questions.add(q2);
        questions.add(q3);

        return questions;
    }
}
