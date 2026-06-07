import redis
import os

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=int(os.getenv("REDIS_DB", 0)),
    decode_responses=True
)

# Standard cache expiration times (in seconds)
CACHE_TTL_SHORT = 300   # 5 minutes for lists (search, category views)
CACHE_TTL_LONG = 3600   # 1 hour for specific product details