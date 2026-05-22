from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.db.db import engine, Base
from app.model.review import Comment
from app.route.review_route import router as review_router

load_dotenv()

app = FastAPI(
    title="Review Service API",
    docs_url="/review/docs",
    redoc_url="/review/redoc",
    openapi_url="/review/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5173",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(review_router, prefix="/review", tags=["reviews"])

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