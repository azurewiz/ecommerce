package com.example.api_gateway.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.List;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    // List of endpoints that do not require authentication
    private final List<String> openApiEndpoints = List.of(
        "/api/auth/register",
        "/api/auth/login"
    );

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    private Key key;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getURI().getPath();

            // 1. Check if the endpoint is public (no token needed)
            if (isEndpointPublic(path)) {
                return chain.filter(exchange); // Let the request pass
            }

            // 2. Get the Authorization header from the request
            HttpHeaders headers = exchange.getRequest().getHeaders();
            if (!headers.containsKey(HttpHeaders.AUTHORIZATION)) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete(); // Reject the request
            }

            // 3. Extract and validate the JWT
            String authHeader = headers.getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String jwt = authHeader.substring(7);
                try {
                    validateToken(jwt); // Check signature and expiration
                } catch (Exception e) {
                    System.out.println("Invalid JWT: " + e.getMessage());
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete(); // Reject on invalid token
                }
            } else {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete(); // Reject if header format is wrong
            }

            // 4. If all checks pass, let the request proceed to the target service
            return chain.filter(exchange);
        };
    }

    private boolean isEndpointPublic(String path) {
        return openApiEndpoints.stream().anyMatch(path::equals);
    }

    private void validateToken(String token) {
        Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    public static class Config {
        // Empty config class
    }
}