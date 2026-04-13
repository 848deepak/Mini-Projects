package com.miniproject.employeeattendancepayroll.controller;

import com.miniproject.employeeattendancepayroll.model.Employee;
import com.miniproject.employeeattendancepayroll.repository.EmployeeRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class EmployeeController {

    private final EmployeeRepository repository;

    public EmployeeController(EmployeeRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("employees", repository.findAll());
        model.addAttribute("newEmployee", new Employee());
        return "index";
    }

    @PostMapping("/add")
    public String addEmployee(@Valid @ModelAttribute("newEmployee") Employee employee, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("employees", repository.findAll());
            return "index";
        }
        repository.save(employee);
        return "redirect:/";
    }

    @PostMapping("/mark-present/{id}")
    public String markPresent(@PathVariable Long id) {
        Employee emp = repository.findById(id).orElseThrow();
        if (emp.getPresentDays() < emp.getWorkingDays()) {
            emp.setPresentDays(emp.getPresentDays() + 1);
            repository.save(emp);
        }
        return "redirect:/";
    }
}
