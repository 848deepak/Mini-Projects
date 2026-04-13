package com.miniproject.cicdfullstackapp.repository;

import com.miniproject.cicdfullstackapp.model.PipelineBuild;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BuildRepository extends JpaRepository<PipelineBuild, Long> {
    List<PipelineBuild> findAllByOrderByStartTimeDesc();
}
