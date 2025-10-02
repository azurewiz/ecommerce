package com.example.orderprocessingservice.controller;

import com.example.orderprocessingservice.model.Order;
import com.example.orderprocessingservice.model.OrderItem;
import com.example.orderprocessingservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // We only need an endpoint to create an order for now
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order createOrder(@RequestBody List<OrderItem> items) {
        return orderService.createOrder(items);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.findAll();
    }
}