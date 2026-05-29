from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Recommendation Service API",
    docs_url="/api/recommendations/docs",
    redoc_url="/api/recommendations/redoc",
    openapi_url="/api/recommendations/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "healthy"}