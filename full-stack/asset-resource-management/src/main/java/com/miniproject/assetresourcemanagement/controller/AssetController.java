package com.miniproject.assetresourcemanagement.controller;

import com.miniproject.assetresourcemanagement.model.Asset;
import com.miniproject.assetresourcemanagement.repository.AssetRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class AssetController {

    private final AssetRepository repository;

    public AssetController(AssetRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("assets", repository.findAll());
        model.addAttribute("newAsset", new Asset());
        return "index";
    }

    @PostMapping("/add")
    public String addAsset(@Valid @ModelAttribute("newAsset") Asset asset, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("assets", repository.findAll());
            return "index";
        }
        if ("Available".equals(asset.getStatus())) {
            asset.setAssignedTo(null);
        }
        repository.save(asset);
        return "redirect:/";
    }

    @PostMapping("/update")
    public String updateAsset(@RequestParam Long id, @RequestParam String status, @RequestParam(required = false) String assignedTo) {
        Asset asset = repository.findById(id).orElseThrow();
        asset.setStatus(status);
        if ("Assigned".equals(status) && assignedTo != null && !assignedTo.isEmpty()) {
            asset.setAssignedTo(assignedTo);
        } else if ("Available".equals(status) || "Under Repair".equals(status) || "Retired".equals(status)) {
            asset.setAssignedTo(null);
        }
        repository.save(asset);
        return "redirect:/";
    }
}
