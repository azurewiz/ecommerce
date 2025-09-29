package com.example.product_catalog_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Document(collection = "products") // Maps this class to the "products" collection in MongoDB
@Data // Lombok: auto-generates getters, setters, toString, etc.
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id; // MongoDB will auto-generate this

    private String name;
    private String description;
    private double price;
}
