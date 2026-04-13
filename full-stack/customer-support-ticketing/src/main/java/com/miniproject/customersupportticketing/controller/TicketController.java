package com.miniproject.customersupportticketing.controller;

import com.miniproject.customersupportticketing.model.Ticket;
import com.miniproject.customersupportticketing.repository.TicketRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class TicketController {

    private final TicketRepository repository;

    public TicketController(TicketRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("tickets", repository.findAll());
        model.addAttribute("newTicket", new Ticket());
        return "index";
    }

    @PostMapping("/submit")
    public String submitTicket(@Valid @ModelAttribute("newTicket") Ticket ticket, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("tickets", repository.findAll());
            return "index";
        }
        repository.save(ticket);
        return "redirect:/";
    }

    @PostMapping("/update-status/{id}")
    public String updateStatus(@PathVariable Long id, @RequestParam String status) {
        Ticket t = repository.findById(id).orElseThrow();
        t.setStatus(status);
        repository.save(t);
        return "redirect:/";
    }
}
