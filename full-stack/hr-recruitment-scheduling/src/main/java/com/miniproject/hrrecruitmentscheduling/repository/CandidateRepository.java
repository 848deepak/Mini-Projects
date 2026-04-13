package com.miniproject.hrrecruitmentscheduling.repository;

import com.miniproject.hrrecruitmentscheduling.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
}
