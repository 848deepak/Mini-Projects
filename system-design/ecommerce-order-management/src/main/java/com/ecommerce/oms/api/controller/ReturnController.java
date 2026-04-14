package com.ecommerce.oms.api.controller;

import com.ecommerce.oms.api.dto.CreateReturnRequest;
import com.ecommerce.oms.api.dto.ReturnResponse;
import com.ecommerce.oms.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/returns")
public class ReturnController {

    private final OrderService orderService;

    public ReturnController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ReturnResponse createReturn(@Valid @RequestBody CreateReturnRequest request) {
        return orderService.createReturn(request);
    }

    @PostMapping("/{returnId}/refund")
    public ReturnResponse processRefund(@PathVariable String returnId) {
        return orderService.processRefund(returnId);
    }
}
