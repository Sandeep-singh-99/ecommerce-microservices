import redis
import os

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=int(os.getenv("REDIS_DB", 0)),
    decode_responses=True
)


CACHE_TTL_REVIEWS = 1800  # 30 minutes
CACHE_TTL_RATING = 3600   # 1 hour