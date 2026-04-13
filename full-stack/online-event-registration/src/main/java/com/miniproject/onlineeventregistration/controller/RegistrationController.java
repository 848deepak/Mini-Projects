package com.miniproject.onlineeventregistration.controller;

import com.miniproject.onlineeventregistration.model.EventRegistration;
import com.miniproject.onlineeventregistration.repository.RegistrationRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class RegistrationController {

    private final RegistrationRepository repository;

    public RegistrationController(RegistrationRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("registrations", repository.findAll());
        model.addAttribute("newReg", new EventRegistration());
        return "index";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("newReg") EventRegistration registration, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("registrations", repository.findAll());
            return "index";
        }
        repository.save(registration);
        return "redirect:/";
    }

    @PostMapping("/checkin/{id}")
    public String checkIn(@PathVariable Long id) {
        EventRegistration reg = repository.findById(id).orElseThrow();
        reg.setCheckedIn(true);
        repository.save(reg);
        return "redirect:/";
    }
}
