package com.example.userservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.jwt")
@Data // Lombok for getters and setters
public class JwtProperties {

    private String secret;
    private long expirationMs; // Use long for milliseconds

}
