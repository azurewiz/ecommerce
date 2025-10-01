package com.example.product_catalog_service.repository;

import com.example.product_catalog_service.model.Product;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    // Spring Data MongoDB is smart enough to create this query from the method name.
    // It finds all products where the 'category' field matches.
    List<Product> findByCategoryIgnoreCase(String category);

    // This finds all products where the 'tags' array contains the specified tag.
    List<Product> findByTags(String tag);

    // This is how you query a nested document (our 'specifications' map).
    // The query finds documents where the specifications field has a key (?0)
    // with a specific value (?1).
    @Query("{ 'specifications.?0' : ?1 }")
    List<Product> findBySpecification(String key, String value);
    // Spring Data MongoDB will automatically implement basic CRUD methods for us!
    // No need to write any code here.
}
