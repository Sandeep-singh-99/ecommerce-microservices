from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.model.product import Product, ProductImage, TrendingProduct
from app.route.product_route import product_route
from app.db.database import engine, base

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
async def on_startup():
    print("Creating database tables...")
    base.metadata.create_all(bind=engine)

app.include_router(product_route, prefix="/api/products", tags=["products"])

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "healthy"}