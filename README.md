# E-Commerce Microservices

A microservices-based e-commerce platform built with Python, FastAPI, and Docker.

## 📁 Project Structure

```
ecommerce-microservices/
├── docker-compose.yml          # Docker Compose configuration for all services
├── requirements.txt             # Root-level Python dependencies
│
├── server/                      # Main server directory
│   ├── gateway/                # API Gateway
│   │   └── nginx.conf          # Nginx configuration
│   │
│   ├── services/               # Microservices
│   │   ├── order-service/      # Order management service
│   │   │   └── requirements.txt
│   │   │
│   │   ├── payment-service/    # Payment processing service
│   │   │   └── requirements.txt
│   │   │
│   │   ├── product-service/    # Product catalog service
│   │   │   └── requirements.txt
│   │   │
│   │   ├── recommendation-service/  # Recommendation engine
│   │   │   └── requirements.txt
│   │   │
│   │   └── user-service/       # User management service
│   │       ├── Dockerfile      # Docker image definition
│   │       ├── requirements.txt # Service dependencies
│   │       └── app/            # Application code
│   │           ├── __init__.py
│   │           ├── main.py     # FastAPI application entry point
│   │           ├── api/        # API routes
│   │           │   └── route.py
│   │           ├── config/     # Configuration management
│   │           │   ├── __init__.py
│   │           │   └── config.py
│   │           ├── db/         # Database utilities
│   │           │   ├── __init__.py
│   │           │   └── database.py
│   │           ├── dependencies/  # Dependency injection
│   │           │   └── dependencies.py
│   │           ├── models/     # Database models
│   │           │   └── user.py
│   │           ├── schemas/    # Pydantic schemas (validation)
│   │           │   └── user_schema.py
│   │           └── utils/      # Utility functions
│   │               ├── cloudinary.py
│   │               └── utils.py
│   │
│   └── shared/                 # Shared utilities across services
│       ├── cloudinary.py       # Cloudinary integration
│       ├── config.py          # Shared configuration
│       ├── dependencies.py     # Shared dependencies
│       └── security.py         # Security utilities (auth, JWT, etc.)
```

## 🏗️ Architecture

This project uses a **microservices architecture** with the following components:

### Services

| Service | Purpose |
|---------|---------|
| **User Service** | User authentication, registration, and profile management |
| **Product Service** | Product catalog management |
| **Order Service** | Order creation and management |
| **Payment Service** | Payment processing and transactions |
| **Recommendation Service** | Personalized product recommendations |

### API Gateway
- **Nginx** acts as the API gateway, routing requests to appropriate microservices

### Shared Module
- Common utilities for Cloudinary integration, configuration, dependencies, and security features used across all services

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Python 3.8+
- Virtual environment

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Build and start services with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. For local development, install dependencies:
   ```bash
   pip install -r requirements.txt
   cd server/services/user-service
   pip install -r requirements.txt
   ```

## 📝 Development Notes

- Each microservice has its own `requirements.txt`
- The `shared/` directory contains reusable components
- FastAPI is used for building REST APIs
- Cloudinary is used for image/media management

## 🔧 Configuration

Configuration files are located in:
- `server/shared/config.py` - Shared configurations
- `server/services/user-service/app/config/config.py` - Service-specific configurations
