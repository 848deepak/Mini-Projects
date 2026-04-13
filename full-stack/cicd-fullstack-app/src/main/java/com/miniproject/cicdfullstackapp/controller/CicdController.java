package com.miniproject.cicdfullstackapp.controller;

import com.miniproject.cicdfullstackapp.model.PipelineBuild;
import com.miniproject.cicdfullstackapp.repository.BuildRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Controller
public class CicdController {

    private final BuildRepository repository;

    public CicdController(BuildRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("builds", repository.findAllByOrderByStartTimeDesc());
        return "index";
    }

    @PostMapping("/trigger")
    public String triggerBuild(@RequestParam String repositoryName, @RequestParam String branchName, @RequestParam String triggeredBy) {
        PipelineBuild pb = new PipelineBuild();
        pb.setRepositoryName(repositoryName);
        pb.setBranchName(branchName);
        pb.setTriggeredBy(triggeredBy);
        pb.setStatus("Running");
        pb.setStartTime(LocalDateTime.now());
        
        repository.save(pb);
        return "redirect:/";
    }

    @PostMapping("/update-status/{id}")
    public String updateStatus(@PathVariable Long id, @RequestParam String status) {
        PipelineBuild pb = repository.findById(id).orElseThrow();
        pb.setStatus(status);
        if ("Success".equals(status) || "Failed".equals(status)) {
            pb.setEndTime(LocalDateTime.now());
        }
        repository.save(pb);
        return "redirect:/";
    }
}
