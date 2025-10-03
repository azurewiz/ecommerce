package com.example.userservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;

    @Indexed(unique = true) // Ensure usernames are unique
    private String username;
    
    @Indexed(unique = true) // Ensure emails are unique
    private String email;

    private String password; // This will store the hashed password
}
