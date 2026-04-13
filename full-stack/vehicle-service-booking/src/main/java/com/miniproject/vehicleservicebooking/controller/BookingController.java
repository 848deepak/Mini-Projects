package com.miniproject.vehicleservicebooking.controller;

import com.miniproject.vehicleservicebooking.model.ServiceBooking;
import com.miniproject.vehicleservicebooking.repository.ServiceBookingRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class BookingController {

    private final ServiceBookingRepository repository;

    public BookingController(ServiceBookingRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("bookings", repository.findAll());
        model.addAttribute("newBooking", new ServiceBooking());
        return "index";
    }

    @PostMapping("/book")
    public String addBooking(@Valid @ModelAttribute("newBooking") ServiceBooking booking, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("bookings", repository.findAll());
            return "index";
        }
        repository.save(booking);
        return "redirect:/";
    }

    @PostMapping("/update-status/{id}")
    public String updateStatus(@PathVariable Long id, @RequestParam String status) {
        ServiceBooking booking = repository.findById(id).orElseThrow();
        booking.setStatus(status);
        repository.save(booking);
        return "redirect:/";
    }

    @PostMapping("/delete/{id}")
    public String deleteBooking(@PathVariable Long id) {
        repository.deleteById(id);
        return "redirect:/";
    }
}
