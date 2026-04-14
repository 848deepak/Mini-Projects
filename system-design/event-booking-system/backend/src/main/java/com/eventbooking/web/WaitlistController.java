package com.eventbooking.web;

import com.eventbooking.domain.Models;
import com.eventbooking.service.EventBookingService;
import com.eventbooking.web.dto.WaitlistDtos;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/waitlist")
public class WaitlistController {

    private final EventBookingService service;

    public WaitlistController(EventBookingService service) {
        this.service = service;
    }

    @PostMapping
    public Models.WaitlistEntry add(@Valid @RequestBody WaitlistDtos.AddWaitlistRequest request) {
        return service.addWaitlist(request.eventId(), request.tierId(), request.quantity(), request.userId());
    }

    @GetMapping("/{waitlistId}")
    public Models.WaitlistEntry get(@PathVariable String waitlistId) {
        return service.getWaitlist(waitlistId);
    }
}
