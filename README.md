# E-Commerce Microservices

A microservices-based e-commerce platform built with Python, FastAPI, and Docker.

## 📁 Project Structure

```
ecommerce-microservices/
├── docker-compose.yml              # Docker Compose configuration for all services
├── requirements.txt                # Root-level Python dependencies
├── README.md                       # Project documentation
├── microservices-design-document.html  # Architecture design document
│
├── certs/                          # SSL/TLS certificates
│
├── client/                         # Frontend (Next.js + TypeScript)
│   ├── package.json                # Node.js dependencies
│   ├── tsconfig.json               # TypeScript configuration
│   ├── next.config.ts              # Next.js configuration
│   ├── eslint.config.mjs           # ESLint configuration
│   ├── postcss.config.mjs          # PostCSS configuration
│   ├── public/                     # Static assets
│   └── app/                        # Next.js App Router
│       ├── layout.tsx              # Root layout
│       ├── page.tsx                # Home page
│       ├── globals.css             # Global styles
│       └── favicon.ico             # Favicon
│
├── server/                         # Backend microservices
│   ├── .env                        # Environment variables
│   │
│   ├── gateway/                    # API Gateway
│   │   └── nginx.conf              # Nginx reverse proxy configuration
│   │
│   ├── services/                   # Microservices
│   │   ├── order-service/          # Order management service
│   │   │   └── requirements.txt
│   │   │
│   │   ├── payment-service/        # Payment processing service
│   │   │   └── requirements.txt
│   │   │
│   │   ├── product-service/        # Product catalog service
│   │   │   ├── Dockerfile          # Docker image definition
│   │   │   ├── requirements.txt    # Service dependencies
│   │   │   ├── alembic.ini         # Alembic configuration
│   │   │   ├── alembic/            # Database migrations (Alembic)
│   │   │   │   ├── env.py          # Migration environment
│   │   │   │   ├── script.py.mako  # Migration template
│   │   │   │   └── versions/       # Migration version files
│   │   │   └── app/                # Application code
│   │   │       ├── __init__.py
│   │   │       ├── main.py         # FastAPI application entry point
│   │   │       ├── db/             # Database utilities
│   │   │       │   └── database.py
│   │   │       ├── model/          # Database models
│   │   │       │   └── product.py
│   │   │       ├── route/          # API routes
│   │   │       │   └── product_route.py
│   │   │       └── schema/         # Pydantic schemas (validation)
│   │   │           └── product_schema.py
│   │   │
│   │   ├── recommendation-service/ # Recommendation engine
│   │   │   └── requirements.txt
│   │   │
│   │   └── user-service/           # User management service
│   │       ├── Dockerfile          # Docker image definition
│   │       ├── requirements.txt    # Service dependencies
│   │       ├── alembic.ini         # Alembic configuration
│   │       ├── migrations/         # Database migrations (Alembic)
│   │       │   ├── env.py          # Migration environment
│   │       │   ├── script.py.mako  # Migration template
│   │       │   └── versions/       # Migration version files
│   │       └── app/                # Application code
│   │           ├── __init__.py
│   │           ├── main.py         # FastAPI application entry point
│   │           ├── api/            # API routes
│   │           │   ├── __init__.py
│   │           │   └── route.py
│   │           ├── config/         # Configuration management
│   │           │   ├── __init__.py
│   │           │   └── config.py
│   │           ├── db/             # Database utilities
│   │           │   ├── __init__.py
│   │           │   └── database.py
│   │           ├── dependencies/   # Dependency injection
│   │           │   ├── __init__.py
│   │           │   └── dependencies.py
│   │           ├── models/         # Database models
│   │           │   ├── __init__.py
│   │           │   └── user.py
│   │           ├── schemas/        # Pydantic schemas (validation)
│   │           │   ├── __init__.py
│   │           │   └── user_schema.py
│   │           └── utils/          # Utility functions
│   │               ├── __init__.py
│   │               ├── cloudinary.py
│   │               └── utils.py
│   │
│   └── shared/                     # Shared utilities across services
│       ├── __init__.py             # Package initializer
│       ├── cloudinary.py           # Cloudinary integration
│       ├── config.py               # Shared configuration
│       ├── dependencies.py         # Shared dependencies
│       └── security.py             # Security utilities (auth, JWT, etc.)
```

## 🏗️ Architecture

This project uses a **microservices architecture** with the following components:

### Frontend
- **Next.js** (TypeScript) client application with App Router

### Services

| Service | Purpose | Status |
|---------|---------|--------|
| **User Service** | User authentication, registration, and profile management | ✅ Active |
| **Product Service** | Product catalog management | ✅ Active |
| **Order Service** | Order creation and management | 🚧 Scaffold |
| **Payment Service** | Payment processing and transactions | 🚧 Scaffold |
| **Recommendation Service** | Personalized product recommendations | 🚧 Scaffold |

### API Gateway
- **Nginx** acts as the API gateway, routing requests to appropriate microservices

### Shared Module
- Common utilities for Cloudinary integration, configuration, dependencies, and security features used across all services

### Database Migrations
- **Alembic** is used for database schema migrations in both the `user-service` and `product-service`

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Python 3.8+
- Node.js 18+ (for the client)
- Virtual environment

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Set up environment variables:
   ```bash
   cp server/.env.example server/.env  # Configure your environment
   ```
4. Build and start services with Docker Compose:
   ```bash
   docker-compose up -d
   ```
5. For local backend development:
   ```bash
   pip install -r requirements.txt
   cd server/services/user-service
   pip install -r requirements.txt
   ```
6. For local frontend development:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 📝 Development Notes

- Each microservice has its own `requirements.txt` and `Dockerfile`
- The `shared/` directory contains reusable components across all backend services
- FastAPI is used for building REST APIs
- Cloudinary is used for image/media management
- Alembic handles database migrations for `user-service` and `product-service`
- The frontend is built with Next.js (TypeScript) using the App Router

## 🔧 Configuration

Configuration files are located in:
- `server/.env` - Environment variables (DB credentials, API keys, secrets)
- `server/shared/config.py` - Shared configurations
- `server/services/user-service/app/config/config.py` - User service configuration
- `server/services/user-service/alembic.ini` - User service migration config
- `server/services/product-service/alembic.ini` - Product service migration config
- `server/gateway/nginx.conf` - API Gateway routing configuration
- `client/next.config.ts` - Next.js frontend configuration
