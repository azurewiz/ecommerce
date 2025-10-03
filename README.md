# Full-Stack E-Commerce Microservice Platform

A comprehensive e-commerce platform built from the ground up, demonstrating a modern, full-stack application architecture. The backend is powered by a suite of independent microservices built with Java and Spring Boot, while the frontend is a dynamic and responsive single-page application created with React.

The architecture emphasizes scalability, security, and separation of concerns, featuring an API Gateway for centralized routing and a JWT-based authentication system for secure transactions.

# ✨ Key Features
## Backend Architecture
Microservice Design: Four independent services for Users, Products, Orders, and a Gateway.

API Gateway: A single entry point (Spring Cloud Gateway) for all client requests, providing centralized routing, security (JWT validation), and CORS management.

JWT Authentication: Secure, stateless authentication handled by a dedicated user-service. Protected routes (like creating an order) are validated at the gateway level.

Database per Service: Each service manages its own data in a dedicated MongoDB collection (users, products, orders), ensuring loose coupling.

Advanced Data Operations: The product-service supports bulk data ingestion from files, partial updates (PATCH), and advanced, database-level filtering and searching.

## Frontend User Experience
React SPA: A fast and modern single-page application for a seamless user experience.

"Loose Sign-Up" Flow: Users can browse, view details, and add items to the cart without an account, only being prompted to log in or register at the point of checkout.

Persistent Cart & Session: The shopping cart and user authentication token are saved in the browser's localStorage, so they persist across page refreshes.

Interactive UI: Features include a product detail modal, a slide-out cart with quantity management, and a dedicated order confirmation page.

# 🏛️ System Architecture
The platform is composed of four backend microservices sitting behind an API Gateway, which serves a React frontend client. All communication from the client goes through the gateway, which routes requests to the appropriate internal service.

React UI (Client, running on localhost:3000)

API Gateway (Single Entry Point, running on localhost:8084)

User Service (Authentication, running on localhost:8085)

Product Service (Data Management, running on localhost:8082)

Order Service (Transactions, running on localhost:8083)




Of course. I understand perfectly. You want a final, professional README.md file that uses the correct Markdown syntax for headings and structure, just like the sample you provided. My apologies for not adhering to that format previously.

Here is the complete and updated README.md file for your final, full-stack project. Please copy this content and replace the text in your existing README.md file.

Full-Stack E-Commerce Microservice Platform
A comprehensive e-commerce platform built from the ground up, demonstrating a modern, full-stack application architecture. The backend is powered by a suite of independent microservices built with Java and Spring Boot, while the frontend is a dynamic and responsive single-page application created with React.

The architecture emphasizes scalability, security, and separation of concerns, featuring an API Gateway for centralized routing and a JWT-based authentication system for secure transactions.

✨ Key Features
Backend Architecture
Microservice Design: Four independent services for Users, Products, Orders, and a Gateway.

API Gateway: A single entry point (Spring Cloud Gateway) for all client requests, providing centralized routing, security (JWT validation), and CORS management.

JWT Authentication: Secure, stateless authentication handled by a dedicated user-service. Protected routes (like creating an order) are validated at the gateway level.

Database per Service: Each service manages its own data in a dedicated MongoDB collection (users, products, orders), ensuring loose coupling.

Advanced Data Operations: The product-service supports bulk data ingestion from files, partial updates (PATCH), and advanced, database-level filtering and searching.

Frontend User Experience
React SPA: A fast and modern single-page application for a seamless user experience.

"Loose Sign-Up" Flow: Users can browse, view details, and add items to the cart without an account, only being prompted to log in or register at the point of checkout.

Persistent Cart & Session: The shopping cart and user authentication token are saved in the browser's localStorage, so they persist across page refreshes.

Interactive UI: Features include a product detail modal, a slide-out cart with quantity management, and a dedicated order confirmation page.

🏛️ System Architecture
The platform is composed of four backend microservices sitting behind an API Gateway, which serves a React frontend client. All communication from the client goes through the gateway, which routes requests to the appropriate internal service.

React UI (Client, running on localhost:3000)

API Gateway (Single Entry Point, running on localhost:8084)

User Service (Authentication, running on localhost:8085)

Product Service (Data Management, running on localhost:8082)

Order Service (Transactions, running on localhost:8083)

# 🛠️ Technologies Used
Backend: Java 17+, Spring Boot, Spring Cloud Gateway, Spring Security, JWT (jjwt library), MongoDB

Frontend: React.js, Tailwind CSS

DevOps & Build: Maven, Git

Cloud: AWS S3 (for image hosting)

# ✅ Prerequisites
Before you begin, ensure you have the following installed:

JDK 17 or higher

Apache Maven

Node.js and npm

A MongoDB Atlas cluster URI

# 🚀 Getting Started
To run the entire platform locally, you will need five separate terminal windows.

## 1. Configuration
Before running, ensure all services are configured correctly:

All Backend Services: In each service's src/main/resources/application.yml file, ensure the MongoDB URI and JWT secret (where applicable) are set correctly.

Frontend UI: In ecommerce-ui/src/App.jsx, ensure the API_GATEWAY_URL constant points to the correct address of your running gateway (e.g., http://localhost:8084).

## 2. Run the Backend Services
Start each backend service in its own terminal. It's best to start the dependency services first.

## Terminal 1: Product Service
cd product-catalog-service
mvn spring-boot:run

## Terminal 2: Order Service
cd order-processing-service
mvn spring-boot:run

## Terminal 3: User Service
cd user-service
mvn spring-boot:run

## Terminal 4: API Gateway
cd api-gateway
mvn spring-boot:run

## 3. Run the Frontend UI
## Terminal 5: React UI
cd ecommerce-ui
npm start

The application will open in your browser at http://localhost:3000.

# 💡 API Testing with Postman
All API requests should be directed to the API Gateway (e.g., on port 8084).

Register a User:

POST /api/auth/register

Login to get a Token:

POST /api/auth/login

(Copy the accessToken from the response for the next step)

Create an Order (Protected):

POST /api/orders

Authorization: Set type to Bearer Token and paste your access token.

Body: [{"productId": "some-id", "quantity": 1}]
