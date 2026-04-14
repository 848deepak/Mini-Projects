package com.eventbooking.web;

import com.eventbooking.domain.Models;
import com.eventbooking.service.EventBookingService;
import com.eventbooking.web.dto.CheckinDtos;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/checkins")
public class CheckinController {

    private final EventBookingService service;

    public CheckinController(EventBookingService service) {
        this.service = service;
    }

    @PostMapping("/validate")
    public Models.CheckinValidation validate(@Valid @RequestBody CheckinDtos.ValidateCheckinRequest request) {
        return service.validateCheckin(request.qrToken(), request.idempotencyKey());
    }
}
