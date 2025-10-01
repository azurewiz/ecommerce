package com.example.product_catalog_service.service;

import com.example.product_catalog_service.model.Product;
import com.example.product_catalog_service.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> searchProducts(String category, Double minPrice, Double maxPrice, String sortBy) {
        // Basic find all, which we will enhance
        // For a more robust solution, you would use MongoTemplate with Criteria API
        // or Specifications, but this demonstrates the logic simply.

        List<Product> products = productRepository.findAll();

        // Filtering logic
        if (category != null && !category.isEmpty()) {
            products.removeIf(p -> !p.getCategory().equalsIgnoreCase(category));
        }
        if (minPrice != null) {
            products.removeIf(p -> p.getPrice() < minPrice);
        }
        if (maxPrice != null) {
            products.removeIf(p -> p.getPrice() > maxPrice);
        }

        // Sorting logic
        if (sortBy != null && !sortBy.isEmpty()) {
            if (sortBy.equalsIgnoreCase("priceAsc")) {
                products.sort((p1, p2) -> Double.compare(p1.getPrice(), p2.getPrice()));
            } else if (sortBy.equalsIgnoreCase("priceDesc")) {
                products.sort((p1, p2) -> Double.compare(p2.getPrice(), p1.getPrice()));
            } else if (sortBy.equalsIgnoreCase("ratingDesc")) {
                products.sort((p1, p2) -> Double.compare(p2.getRating(), p1.getRating()));
            }
        }
        
        return products;
    }
}

