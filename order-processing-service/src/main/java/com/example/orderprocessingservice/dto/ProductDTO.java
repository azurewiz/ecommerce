package com.example.orderprocessingservice.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ProductDTO {
    // Existing fields
    private String id;
    private String name;
    private String description;
    private double price;
    
    // New fields to match the complex Product model
    private String category;
    private String brand;
    private double rating;
    private List<String> features;
    private List<String> tags;
    private Map<String, String> specifications;
    private int selectionCount;
}