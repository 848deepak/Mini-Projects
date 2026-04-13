package com.miniproject.taskprojectcollaboration.repository;

import com.miniproject.taskprojectcollaboration.model.ProjectTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<ProjectTask, Long> {
}
