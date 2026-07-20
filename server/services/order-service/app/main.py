from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base
from app.model.order import Order, OrderItem
from app.route.order_route import router as order_router

app = FastAPI(
    title="Order Service API",
    description="Microservice responsible for order creation, pricing validation, stock check, order retrieval, and state management.",
    version="1.0.0",
    docs_url="/orders/docs",
    redoc_url="/orders/redoc",
    openapi_url="/orders/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    # Ensure database tables exist
    Base.metadata.create_all(bind=engine)


# Mount router under /orders and /api/v1/orders
app.include_router(order_router, prefix="/orders", tags=["Orders"])
app.include_router(order_router, prefix="/api/v1/orders", tags=["Orders Legacy Prefix"])


@app.get("/", tags=["root"])
async def read_root():
    return {"service": "Order Service", "status": "running"}


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy", "service": "Order Service"}