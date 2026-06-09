import os
from dotenv import load_dotenv

load_dotenv()

# Dodo Payments configurations
DODO_API_KEY = os.getenv("DODO_API_KEY", "")
DODO_WEBHOOK_SECRET = os.getenv("DODO_WEBHOOK_SECRET", "")
DODO_ENV = os.getenv("DODO_ENV", "sandbox")  # sandbox (test_mode) or live (live_mode)

# Redis configurations
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))

# Database connection
# We default to a local sqlite file if no database connection is supplied for payment service
DATABASE_URL = os.getenv("DATABASE_URL_PAYMENT_SERVICE")
if not DATABASE_URL:
    # Use SQLite for local development fallback
    DATABASE_URL = "sqlite:///payments.db"

# JWT configuration for validating client credentials if needed (shared with other services)
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "defaultsecret")
