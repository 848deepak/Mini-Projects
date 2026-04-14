package com.miniprojects.crm.repository;

import com.miniprojects.crm.model.CrmTask;
import com.miniprojects.crm.model.TaskStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrmTaskRepository extends JpaRepository<CrmTask, String> {
    List<CrmTask> findByStatus(TaskStatus status);
}
