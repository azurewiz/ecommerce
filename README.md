# E-Commerce Microservice Platform

A foundational e-commerce backend built using a microservice architecture with Java and Spring Boot. This project demonstrates key principles of modern cloud-native application development, including service independence, API-based communication, and the database-per-service pattern.



---

## 🏛️ Architecture

This platform consists of two primary microservices:

* **Product Catalog Service**: Manages all product information. It acts as the single source of truth for product data, handling all CRUD (Create, Read, Update, Delete) operations.
* **Order Processing Service**: Handles the creation and management of customer orders. It communicates with the Product Catalog service via a REST API to validate product details and pricing before finalizing an order.

Each service is a standalone Spring Boot application with its own dedicated MongoDB database, ensuring loose coupling and independent scalability.

---

## 🛠️ Technologies Used

* **Java 17+**
* **Spring Boot 3**
* **Spring Web** (for REST APIs)
* **Spring Data MongoDB** (for database interaction)
* **MongoDB** (NoSQL Database)
* **Maven** (Dependency Management)
* **Lombok**

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:
* JDK 17 or higher
* Apache Maven
* A tool for testing APIs, such as [Postman](https://www.postman.com/)
* A MongoDB Atlas account for your database cluster

---

## 🚀 Getting Started

Follow these steps to get the application running locally.

### 1. Clone the Repository
```bash
git clone https://github.com/azurewiz/ecommerce.git
cd e-commerce-microservice-platform