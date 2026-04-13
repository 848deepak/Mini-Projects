package com.miniproject.elearningdoubtresolution.controller;

import com.miniproject.elearningdoubtresolution.model.Doubt;
import com.miniproject.elearningdoubtresolution.repository.DoubtRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Controller
public class DoubtController {

    private final DoubtRepository repository;

    public DoubtController(DoubtRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("doubts", repository.findAllByOrderByCreatedAtDesc());
        model.addAttribute("newDoubt", new Doubt());
        return "index";
    }

    @PostMapping("/ask")
    public String askQuestion(@Valid @ModelAttribute("newDoubt") Doubt doubt, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("doubts", repository.findAllByOrderByCreatedAtDesc());
            return "index";
        }
        repository.save(doubt);
        return "redirect:/";
    }

    @PostMapping("/answer/{id}")
    public String provideAnswer(@PathVariable Long id, @RequestParam String answer, @RequestParam String answeredBy) {
        Doubt doubt = repository.findById(id).orElseThrow();
        if (answer != null && !answer.trim().isEmpty()) {
            doubt.setAnswer(answer);
            doubt.setAnsweredBy(answeredBy);
            doubt.setResolved(true);
            doubt.setAnsweredAt(LocalDateTime.now());
            repository.save(doubt);
        }
        return "redirect:/";
    }
}
