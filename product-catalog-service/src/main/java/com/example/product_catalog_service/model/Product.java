package com.example.product_catalog_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

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
    
    private List<String> features;
    private List<String> tags;
    private Map<String, String> specifications;
    
    private String imageUrl; // Added for product images

    private int selectionCount = 0;
}