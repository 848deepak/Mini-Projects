package com.miniprojects.crm.repository;

import com.miniprojects.crm.model.Interaction;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InteractionRepository extends JpaRepository<Interaction, String> {
    List<Interaction> findByEntityIdOrderByOccurredAtDesc(String entityId);
}
