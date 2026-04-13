package com.miniproject.vehicleservicebooking.repository;

import com.miniproject.vehicleservicebooking.model.ServiceBooking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceBookingRepository extends JpaRepository<ServiceBooking, Long> {
}
