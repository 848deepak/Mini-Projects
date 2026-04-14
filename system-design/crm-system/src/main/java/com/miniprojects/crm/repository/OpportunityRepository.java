package com.miniprojects.crm.repository;

import com.miniprojects.crm.model.Opportunity;
import com.miniprojects.crm.model.OpportunityStage;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpportunityRepository extends JpaRepository<Opportunity, String> {
    List<Opportunity> findByStageAndOwnerUserIdAndExpectedCloseDateBetween(
        OpportunityStage stage,
        String ownerUserId,
        LocalDate from,
        LocalDate to
    );
    List<Opportunity> findByExpectedCloseDateBetween(LocalDate from, LocalDate to);
}
