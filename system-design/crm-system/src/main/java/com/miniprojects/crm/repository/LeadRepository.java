package com.miniprojects.crm.repository;

import com.miniprojects.crm.model.Lead;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository extends JpaRepository<Lead, String> {
    Optional<Lead> findByEmailIgnoreCase(String email);
}
