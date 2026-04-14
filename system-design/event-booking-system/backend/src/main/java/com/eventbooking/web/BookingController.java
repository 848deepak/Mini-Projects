package com.eventbooking.web;

import com.eventbooking.domain.Models;
import com.eventbooking.service.EventBookingService;
import com.eventbooking.web.dto.BookingDtos;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/bookings")
public class BookingController {

    private final EventBookingService service;

    public BookingController(EventBookingService service) {
        this.service = service;
    }

    @PostMapping
    public Models.Booking create(@Valid @RequestBody BookingDtos.CreateBookingRequest request) {
        return service.confirmBooking(request.holdId(), request.userId(), request.idempotencyKey());
    }

    @PostMapping("/{bookingId}/cancel")
    public Models.Booking cancel(@PathVariable String bookingId) {
        return service.cancelBooking(bookingId);
    }

    @GetMapping
    public List<Models.Booking> userBookings(@RequestParam String userId) {
        return service.listBookingsByUser(userId);
    }
}
