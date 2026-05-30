package com.karthificial.backend.repository;

import com.karthificial.backend.model.McqAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface McqAttemptRepository extends JpaRepository<McqAttempt, Long> {

    long countByMcqSet(String mcqSet);

}
