from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.model.cart import Cart
from app.db.db import engine, Base


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
    Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "healthy"}