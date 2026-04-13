package com.miniproject.hrrecruitmentscheduling.controller;

import com.miniproject.hrrecruitmentscheduling.model.Candidate;
import com.miniproject.hrrecruitmentscheduling.repository.CandidateRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class RecruitmentController {

    private final CandidateRepository repository;

    public RecruitmentController(CandidateRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("candidates", repository.findAll());
        model.addAttribute("newCandidate", new Candidate());
        return "index";
    }

    @PostMapping("/apply")
    public String apply(@Valid @ModelAttribute("newCandidate") Candidate candidate, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("candidates", repository.findAll());
            return "index";
        }
        repository.save(candidate);
        return "redirect:/";
    }

    @PostMapping("/update-status/{id}")
    public String updateStatus(@PathVariable Long id, @RequestParam String status) {
        Candidate c = repository.findById(id).orElseThrow();
        c.setStatus(status);
        repository.save(c);
        return "redirect:/";
    }
}
