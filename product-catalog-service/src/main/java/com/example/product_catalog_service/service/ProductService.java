package com.example.product_catalog_service.service;

import com.example.product_catalog_service.model.Product;
import com.example.product_catalog_service.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product updateProduct(String id, Map<String, Object> updates) {
        Product productToUpdate = productRepository.findById(id)
                .orElseThrow(() -> new ResourceAccessException("Product not found with id: " + id));

        updates.forEach((field, value) -> {
            switch (field) {
                case "name":
                    productToUpdate.setName((String) value);
                    break;
                case "description":
                    productToUpdate.setDescription((String) value);
                    break;
                case "price":
                    if (value instanceof Number) {
                        productToUpdate.setPrice(((Number) value).doubleValue());
                    }
                    break;
                case "category":
                    productToUpdate.setCategory((String) value);
                    break;
                case "brand":
                    productToUpdate.setBrand((String) value);
                    break;
                case "rating":
                     if (value instanceof Number) {
                        productToUpdate.setRating(((Number) value).doubleValue());
                    }
                    break;
                case "tags":
                    if (value instanceof List) {
                        productToUpdate.setTags((List<String>) value);
                    }
                    break;
                case "imageUrl": // <-- LOGIC TO UPDATE imageUrl
                    productToUpdate.setImageUrl((String) value);
                    break;
            }
        });

        return productRepository.save(productToUpdate);
    }
}