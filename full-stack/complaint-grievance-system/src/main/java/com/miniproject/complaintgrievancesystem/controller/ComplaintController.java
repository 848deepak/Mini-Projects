package com.miniproject.complaintgrievancesystem.controller;

import com.miniproject.complaintgrievancesystem.model.Complaint;
import com.miniproject.complaintgrievancesystem.repository.ComplaintRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class ComplaintController {

    private final ComplaintRepository repository;

    public ComplaintController(ComplaintRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("complaints", repository.findAll());
        model.addAttribute("newComplaint", new Complaint());
        return "index";
    }

    @PostMapping("/submit")
    public String submitComplaint(@Valid @ModelAttribute("newComplaint") Complaint complaint, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("complaints", repository.findAll());
            return "index";
        }
        repository.save(complaint);
        return "redirect:/";
    }

    @PostMapping("/update-status/{id}")
    public String updateStatus(@PathVariable Long id, @RequestParam String status) {
        Complaint c = repository.findById(id).orElseThrow();
        c.setStatus(status);
        repository.save(c);
        return "redirect:/";
    }
}
