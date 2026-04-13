package com.miniproject.elearningdoubtresolution.repository;

import com.miniproject.elearningdoubtresolution.model.Doubt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoubtRepository extends JpaRepository<Doubt, Long> {
    List<Doubt> findAllByOrderByCreatedAtDesc();
}
