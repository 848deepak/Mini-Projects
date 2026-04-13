package com.miniproject.realtimenotificationsystem.controller;

import com.miniproject.realtimenotificationsystem.model.Notification;
import com.miniproject.realtimenotificationsystem.repository.NotificationRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

@Controller
public class NotificationController {

    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("notifications", repository.findAll(Sort.by(Sort.Direction.DESC, "timestamp")));
        model.addAttribute("newNotification", new Notification());
        return "index";
    }

    @PostMapping("/send")
    public String sendNotification(@Valid @ModelAttribute("newNotification") Notification notification, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("notifications", repository.findAll(Sort.by(Sort.Direction.DESC, "timestamp")));
            return "index";
        }
        repository.save(notification);
        return "redirect:/";
    }

    @PostMapping("/mark-read/{id}")
    public String markAsRead(@PathVariable Long id) {
        Notification n = repository.findById(id).orElseThrow();
        n.setReadStatus(true);
        repository.save(n);
        return "redirect:/";
    }
    
    @PostMapping("/mark-all-read")
    public String markAllAsRead() {
        var unread = repository.findAll().stream().filter(n -> !n.isReadStatus()).toList();
        for (var n : unread) {
            n.setReadStatus(true);
            repository.save(n);
        }
        return "redirect:/";
    }
}
