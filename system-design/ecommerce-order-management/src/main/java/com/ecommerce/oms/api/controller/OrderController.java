package com.ecommerce.oms.api.controller;

import com.ecommerce.oms.api.dto.*;
import com.ecommerce.oms.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrder(@PathVariable String orderId) {
        return orderService.getOrder(orderId);
    }

    @GetMapping
    public List<OrderResponse> listOrders(@RequestParam String customerId) {
        return orderService.listOrdersByCustomer(customerId);
    }

    @PostMapping("/{orderId}/payment")
    public OrderResponse updatePayment(@PathVariable String orderId, @Valid @RequestBody PaymentUpdateRequest request) {
        return orderService.updatePayment(orderId, request);
    }

    @PostMapping("/{orderId}/cancel")
    public OrderResponse cancelOrder(@PathVariable String orderId, @Valid @RequestBody CancelOrderRequest request) {
        return orderService.cancelOrder(orderId, request);
    }

    @PostMapping("/{orderId}/shipments")
    public OrderResponse createShipment(@PathVariable String orderId, @Valid @RequestBody CreateShipmentRequest request) {
        return orderService.createShipment(orderId, request);
    }

    @PostMapping("/{orderId}/deliver")
    public OrderResponse markDelivered(@PathVariable String orderId) {
        return orderService.markDelivered(orderId);
    }
}
