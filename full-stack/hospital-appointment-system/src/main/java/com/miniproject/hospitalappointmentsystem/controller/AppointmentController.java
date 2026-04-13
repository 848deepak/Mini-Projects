package com.miniproject.hospitalappointmentsystem.controller;

import com.miniproject.hospitalappointmentsystem.model.Appointment;
import com.miniproject.hospitalappointmentsystem.repository.AppointmentRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class AppointmentController {

    private final AppointmentRepository repository;

    public AppointmentController(AppointmentRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("appointments", repository.findAllByOrderByAppointmentDateAscAppointmentTimeAsc());
        model.addAttribute("newAppointment", new Appointment());
        return "index";
    }

    @PostMapping("/book")
    public String bookAppointment(@Valid @ModelAttribute("newAppointment") Appointment appointment, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("appointments", repository.findAllByOrderByAppointmentDateAscAppointmentTimeAsc());
            return "index";
        }
        repository.save(appointment);
        return "redirect:/";
    }

    @PostMapping("/status/{id}")
    public String updateStatus(@PathVariable Long id, @RequestParam String status) {
        Appointment apt = repository.findById(id).orElseThrow();
        apt.setStatus(status);
        repository.save(apt);
        return "redirect:/";
    }
}
