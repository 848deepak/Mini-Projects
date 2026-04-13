package com.miniproject.taskprojectcollaboration.controller;

import com.miniproject.taskprojectcollaboration.model.ProjectTask;
import com.miniproject.taskprojectcollaboration.repository.TaskRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class TaskController {

    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("tasks", repository.findAll());
        model.addAttribute("newTask", new ProjectTask());
        return "index";
    }

    @PostMapping("/add")
    public String addTask(@Valid @ModelAttribute("newTask") ProjectTask task, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("tasks", repository.findAll());
            return "index";
        }
        repository.save(task);
        return "redirect:/";
    }

    @PostMapping("/update/{id}")
    public String updateStatus(@PathVariable Long id, @RequestParam String status) {
        ProjectTask task = repository.findById(id).orElseThrow();
        task.setStatus(status);
        repository.save(task);
        return "redirect:/";
    }
}
