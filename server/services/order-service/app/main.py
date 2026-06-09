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

from app.route.order_route import router as order_router
app.include_router(order_router, prefix="/api/v1/orders", tags=["orders"])


from sqlalchemy import text

@app.on_event("startup")
async def on_startup():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    # Ensure status column exists in orders table
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'pending';"))
            conn.commit()
    except Exception as e:
        print(f"Error checking/adding status column: {e}")


@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy"}