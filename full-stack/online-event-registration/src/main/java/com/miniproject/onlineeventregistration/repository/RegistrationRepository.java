package com.miniproject.onlineeventregistration.repository;

import com.miniproject.onlineeventregistration.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<EventRegistration, Long> {
}
