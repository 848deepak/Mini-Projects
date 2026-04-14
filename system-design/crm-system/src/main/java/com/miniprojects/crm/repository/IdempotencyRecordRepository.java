package com.miniprojects.crm.repository;

import com.miniprojects.crm.model.IdempotencyRecord;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IdempotencyRecordRepository extends JpaRepository<IdempotencyRecord, String> {
    Optional<IdempotencyRecord> findByKeyValue(String keyValue);
}
