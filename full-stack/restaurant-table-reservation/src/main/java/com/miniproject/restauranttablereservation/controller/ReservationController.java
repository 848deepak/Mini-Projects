package com.miniproject.restauranttablereservation.controller;

import com.miniproject.restauranttablereservation.model.Reservation;
import com.miniproject.restauranttablereservation.repository.ReservationRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class ReservationController {

    private final ReservationRepository repository;

    public ReservationController(ReservationRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("reservations", repository.findAllByOrderByReservationDateAscReservationTimeAsc());
        model.addAttribute("newReservation", new Reservation());
        return "index";
    }

    @PostMapping("/reserve")
    public String makeReservation(@Valid @ModelAttribute("newReservation") Reservation reservation, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("reservations", repository.findAllByOrderByReservationDateAscReservationTimeAsc());
            return "index";
        }
        repository.save(reservation);
        return "redirect:/";
    }

    @PostMapping("/status/{id}")
    public String updateStatus(@PathVariable Long id, @RequestParam String status) {
        Reservation res = repository.findById(id).orElseThrow();
        res.setStatus(status);
        repository.save(res);
        return "redirect:/";
    }
}
