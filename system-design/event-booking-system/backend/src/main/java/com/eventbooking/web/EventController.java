package com.eventbooking.web;

import com.eventbooking.domain.Models;
import com.eventbooking.service.EventBookingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1")
public class EventController {

    private final EventBookingService service;

    public EventController(EventBookingService service) {
        this.service = service;
    }

    @GetMapping("/events")
    public List<Models.Event> events(@RequestParam(required = false) String city,
                                     @RequestParam(required = false, name = "q") String query) {
        return service.listEvents(city, query);
    }

    @GetMapping("/events/{eventId}")
    public Models.Event event(@PathVariable String eventId) {
        return service.getEvent(eventId);
    }

    @GetMapping("/events/{eventId}/availability")
    public List<Models.Availability> availability(@PathVariable String eventId) {
        return service.getAvailability(eventId);
    }

    @GetMapping("/healthview")
    public Map<String, Object> healthView() {
        return service.healthView();
    }
}
