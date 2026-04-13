package com.miniproject.customersupportticketing.repository;

import com.miniproject.customersupportticketing.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
}
