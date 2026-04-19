from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.route import router as user_router
from app.db.database import engine, base
from app.models.user import User
load_dotenv()


app = FastAPI(
    title="User Service API",
    # Tell FastAPI to host docs under the /users route
    docs_url="/users/docs",
    redoc_url="/users/redoc",
    openapi_url="/users/openapi.json"
)

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

app.include_router(user_router, prefix="/users", tags=["users"])

@app.get("/", tags=["root"])
def read_root():
    return {"Hello": "World"}

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "healthy"}
