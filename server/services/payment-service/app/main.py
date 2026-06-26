from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.model.payment import Payment
from app.db.db import Base, engine
from app.route.payment_route import router as payment_router

app = FastAPI(
    title="Cart Service API",
    docs_url="/api/payment/docs",
    redoc_url="/api/payment/redoc",
    openapi_url="/api/payment/openapi.json"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(payment_router, prefix="/api/payment", tags=["cart"])

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "healthy"}