package com.example.product_catalog_service.service;

import com.example.product_catalog_service.model.Product;
import com.example.product_catalog_service.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException; // You may need to import this

import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // We have REMOVED the old, inefficient searchProducts method.
    // Our controller now uses the more performant repository methods directly.

    /**
     * Partially updates a product based on the provided fields.
     * @param id The ID of the product to update.
     * @param updates A map of field names to their new values.
     * @return The updated and saved product.
     */
    public Product updateProduct(String id, Map<String, Object> updates) {
        // 1. Find the product in the database or throw an error if not found.
        Product productToUpdate = productRepository.findById(id)
                .orElseThrow(() -> new ResourceAccessException("Product not found with id: " + id));

        // 2. Iterate through the updates from the request body.
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
                // You can add more cases here for 'features' or 'specifications' if needed.
            }
        });

        // 3. Save the updated product back to the database.
        return productRepository.save(productToUpdate);
    }
}