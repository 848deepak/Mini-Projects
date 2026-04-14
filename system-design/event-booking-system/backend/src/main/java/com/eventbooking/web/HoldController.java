package com.eventbooking.web;

import com.eventbooking.domain.Models;
import com.eventbooking.service.EventBookingService;
import com.eventbooking.web.dto.HoldDtos;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/holds")
public class HoldController {

    private final EventBookingService service;

    public HoldController(EventBookingService service) {
        this.service = service;
    }

    @PostMapping
    public Models.Hold create(@Valid @RequestBody HoldDtos.CreateHoldRequest request) {
        return service.createHold(
                request.eventId(),
                request.tierId(),
                request.quantity(),
                request.userId(),
                request.idempotencyKey()
        );
    }
}
