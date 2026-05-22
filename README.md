# E-Commerce Microservices

A microservices-based e-commerce platform built with Python, FastAPI, Docker, and a Vite + React frontend.

## 📁 Project Structure

```
ecommerce-microservices/
├── docker-compose.yml              # Docker Compose configuration for the stack
├── requirements.txt                # Root-level Python dependency list
├── README.md                       # Project documentation
├── microservices-design-document.html  # Architecture design document
├── client/                         # Frontend application (Vite + React + TypeScript)
│   ├── package.json                # Frontend dependencies and scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── vite.config.ts              # Vite configuration
│   ├── src/                        # React application source code
│   ├── public/                     # Static assets
│   └── README.md                   # Frontend-specific documentation
├── server/                         # Backend microservices
│   ├── .env                        # Backend environment variables
│   ├── gateway/                    # API gateway configuration
│   │   └── nginx.conf              # Nginx reverse proxy configuration
│   ├── services/                   # Microservice implementations
│   │   ├── cart-service/
│   │   ├── order-service/
│   │   ├── payment-service/
│   │   ├── product-service/
│   │   ├── recommendation-service/
│   │   ├── review-service/
│   │   └── user-service/
│   └── shared/                     # Shared backend utilities
│       ├── cloudinary.py
│       ├── config.py
│       ├── dependencies.py
│       └── security.py
```

## 🏗️ Architecture

This project is built as a distributed microservices system:

- **Frontend**: Vite + React + TypeScript client application
- **API Gateway**: Nginx reverse proxy routing requests to backend services
- **Microservices**:
  - `user-service` — authentication, registration, and user profile management
  - `product-service` — product catalog management
  - `review-service` — product review handling
  - `cart-service` — shopping cart operations
  - `order-service` — order processing (scaffold)
  - `payment-service` — payment processing (scaffold)
  - `recommendation-service` — recommendations engine (scaffold)
- **Shared Backend Utilities**: common configuration, security, Cloudinary integration, and dependency helpers

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for the frontend)
- Python 3.8+ (for backend development)

### Run with Docker Compose

From the repository root:

```bash
docker-compose up -d
```

Then open:

- Frontend: `http://localhost:5173`
- API gateway: `http://localhost`

### Local Frontend Development

```bash
cd client
npm install
npm run dev
```

### Local Backend Development Example

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r server/services/user-service/requirements.txt
cd server/services/user-service
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 🔧 Configuration

Important files:

- `server/.env` — backend environment variables
- `server/gateway/nginx.conf` — API gateway routing config
- `client/package.json` — frontend scripts and dependencies
- `docker-compose.yml` — Docker services, ports, and health checks
- `server/shared/` — shared backend utilities used by multiple services

## 📝 Notes

- The frontend uses React, TypeScript, Tailwind, and Vite.
- Backend services are built with FastAPI and are containerized with Docker.
- `user-service`, `product-service`, `review-service`, and `cart-service` are included in `docker-compose.yml`.
- `order-service`, `payment-service`, and `recommendation-service` are present in the repository as additional service directories.
- Alembic migrations are used for services that manage database schemas.

## 📌 Tips

- If `server/.env` is not present, copy from an existing example or create one with required values.
- Use `docker-compose logs -f <service>` to inspect service output during startup.
- Edit frontend files in `client/src/` and backend code in `server/services/<service>/app/`.
