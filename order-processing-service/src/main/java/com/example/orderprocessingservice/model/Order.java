package com.example.orderprocessingservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
@Data
public class Order {

    @Id
    private String id;

    private LocalDateTime orderDate;
    private List<OrderItem> items;
    private double totalPrice;
    private String status; // e.g., PENDING, COMPLETED, CANCELLED
}
