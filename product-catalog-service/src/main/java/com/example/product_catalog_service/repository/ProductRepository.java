package com.example.product_catalog_service.repository;

import com.example.product_catalog_service.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    // Spring Data MongoDB will automatically implement basic CRUD methods for us!
    // No need to write any code here.
}
