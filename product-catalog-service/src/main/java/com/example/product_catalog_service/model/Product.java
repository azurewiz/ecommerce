package com.example.product_catalog_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List; // <-- NEW: Required for lists/arrays
import java.util.Map;  // <-- NEW: Required for nested objects

@Document(collection = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;

    private String name;
    private String description;
    private double price;
    private String category;
    private String brand;
    private double rating;
    
    // NEW: Fields to handle complex data from the JSON file
    private List<String> features;
    private List<String> tags;
    private Map<String, String> specifications;

    private int selectionCount = 0;
}