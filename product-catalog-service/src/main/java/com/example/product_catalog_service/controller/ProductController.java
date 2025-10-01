package com.example.product_catalog_service.controller;

import com.example.product_catalog_service.model.Product;
import com.example.product_catalog_service.repository.ProductRepository;
import com.example.product_catalog_service.service.ProductService;
import com.fasterxml.jackson.core.type.TypeReference; // <-- FIX: Import was missing
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService; 

    @PatchMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        try {
            Product updatedProduct = productService.updateProduct(id, updates);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // NEW ENDPOINT: Delete all products for easy cleanup
    @DeleteMapping("/all")
    public ResponseEntity<String> deleteAllProducts() {
        productRepository.deleteAll();
        return ResponseEntity.ok("All products have been deleted.");
    }

    // GET all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    // NEW, POWERFUL SEARCH ENDPOINT
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String specKey,
            @RequestParam(required = false) String specValue
    ) {
        if (tag != null) {
            return ResponseEntity.ok(productRepository.findByTags(tag));
        }
        if (category != null) {
            return ResponseEntity.ok(productRepository.findByCategoryIgnoreCase(category));
        }
        if (specKey != null && specValue != null) {
            return ResponseEntity.ok(productRepository.findBySpecification(specKey, specValue));
        }
        return ResponseEntity.badRequest().build();
    }

    // GET a single product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST a new product for single product creation
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    // POST endpoint for file uploads
    @PostMapping("/upload")
    public ResponseEntity<String> uploadProductsFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty.");
        }
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<List<Product>> typeReference = new TypeReference<>() {};
        try (InputStream inputStream = file.getInputStream()) {
            List<Product> products = mapper.readValue(inputStream, typeReference);
            productRepository.saveAll(products);
            return ResponseEntity.status(HttpStatus.CREATED).body(products.size() + " products ingested successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to parse or save products.");
        }
    }
        // NEW ENDPOINT: Increment the selection count for a product
    @PutMapping("/{id}/select")
    public ResponseEntity<Product> selectProduct(@PathVariable String id) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            product.setSelectionCount(product.getSelectionCount() + 1); // Increment the count
            productRepository.save(product); // Save the updated product
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Add this method to your ProductController.java
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // Standard for successful delete
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}