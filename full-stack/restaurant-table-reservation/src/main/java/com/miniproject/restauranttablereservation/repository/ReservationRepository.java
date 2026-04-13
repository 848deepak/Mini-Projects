package com.miniproject.restauranttablereservation.repository;

import com.miniproject.restauranttablereservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findAllByOrderByReservationDateAscReservationTimeAsc();
}
