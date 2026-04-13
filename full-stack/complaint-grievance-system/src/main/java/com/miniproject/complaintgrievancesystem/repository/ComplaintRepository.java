package com.miniproject.complaintgrievancesystem.repository;

import com.miniproject.complaintgrievancesystem.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
}
