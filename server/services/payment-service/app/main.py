from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.payment_route import router as payment_router

app = FastAPI(
    title="Payment Service API",
    docs_url="/payments/docs",
    redoc_url="/payments/redoc",
    openapi_url="/payments/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Startup database initialization
@app.on_event("startup")
async def on_startup():
    print("Initializing Payment Database tables...")
    Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(payment_router, prefix="/payments", tags=["payments"])

@app.get("/")
def read_root():
    return {"message": "Hello from Payment Service!"}

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "healthy"}
