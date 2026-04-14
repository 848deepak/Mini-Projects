package com.cabfleet.repository;

import com.cabfleet.entity.DispatchAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DispatchAssignmentRepository extends JpaRepository<DispatchAssignment, String> {
    List<DispatchAssignment> findByRequestIdOrderByOfferedAtDesc(String requestId);
    Optional<DispatchAssignment> findByRequestIdAndState(String requestId, DispatchAssignment.AssignmentState state);
    List<DispatchAssignment> findByDriverIdAndState(String driverId, DispatchAssignment.AssignmentState state);
}
