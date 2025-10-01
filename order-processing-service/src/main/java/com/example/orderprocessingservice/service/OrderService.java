package com.example.orderprocessingservice.service;

import com.example.orderprocessingservice.dto.ProductDTO;
import com.example.orderprocessingservice.model.Order;
import com.example.orderprocessingservice.model.OrderItem;
import com.example.orderprocessingservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${product.service.url}")
    private String productServiceUrl;

    public Order createOrder(List<OrderItem> requestedItems) {
        // 1. Validate and fetch product details from the Product Catalog Service
        List<OrderItem> processedItems = requestedItems.stream()
            .map(item -> {
                // Call the product service for each item
                ProductDTO product = restTemplate.getForObject(productServiceUrl + "/" + item.getProductId(), ProductDTO.class);
                if (product == null) {
                    throw new IllegalArgumentException("Product not found: " + item.getProductId());
                }
                // Use the fetched price and name
                return new OrderItem(
                    product.getId(),
                    product.getName(),
                    item.getQuantity(),
                    product.getPrice() // Price at the time of purchase
                );
            })
            .collect(Collectors.toList());

        // 2. Calculate total price
        double totalPrice = processedItems.stream()
            .mapToDouble(processedItem -> processedItem.getPriceAtPurchase() * processedItem.getQuantity())
            .sum();

        // 3. Create and save the order
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setItems(processedItems);
        order.setTotalPrice(totalPrice);
        order.setStatus("PENDING");

        return orderRepository.save(order);
    }
    
    // This method is for your GET request
    public List<Order> findAll() {
        return orderRepository.findAll();
    }
}