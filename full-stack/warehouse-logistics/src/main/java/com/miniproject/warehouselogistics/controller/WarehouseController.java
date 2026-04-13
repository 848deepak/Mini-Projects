package com.miniproject.warehouselogistics.controller;

import com.miniproject.warehouselogistics.model.WarehouseItem;
import com.miniproject.warehouselogistics.repository.WarehouseItemRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class WarehouseController {

    private final WarehouseItemRepository repository;

    public WarehouseController(WarehouseItemRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("items", repository.findAll());
        model.addAttribute("newItem", new WarehouseItem());
        return "index";
    }

    @PostMapping("/add")
    public String addItem(@Valid @ModelAttribute("newItem") WarehouseItem item, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("items", repository.findAll());
            return "index";
        }
        updateStatusBasedOnQuantity(item);
        repository.save(item);
        return "redirect:/";
    }

    @PostMapping("/stock/{id}")
    public String updateStock(@PathVariable Long id, @RequestParam int adjustment) {
        WarehouseItem item = repository.findById(id).orElseThrow();
        int newQty = item.getQuantity() + adjustment;
        if (newQty < 0) newQty = 0;
        item.setQuantity(newQty);
        updateStatusBasedOnQuantity(item);
        repository.save(item);
        return "redirect:/";
    }
    
    private void updateStatusBasedOnQuantity(WarehouseItem item) {
        if (item.getQuantity() == 0) {
            item.setStatus("Out of Stock");
        } else if (item.getQuantity() < 10) {
            item.setStatus("Low Stock");
        } else {
            item.setStatus("In Stock");
        }
    }
}
