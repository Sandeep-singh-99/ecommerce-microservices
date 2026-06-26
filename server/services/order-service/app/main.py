from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.model.order import Order, OrderItem


app = FastAPI(
    title="Order Service",
    doc_url="/api/v1/orders/docs",
    redoc_url="/api/v1/orders/redoc",
    openapi_url="/api/v1/orders/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy"}