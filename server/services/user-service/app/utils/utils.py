from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import hashlib # Added for pre-hashing
from app.config.config import JWT_SECRET_KEY, ACCESS_TOKEN_EXPIRE_DAYS

# We keep bcrypt, but we will wrap the password to fix the limit
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # Pre-hash with SHA256 to solve the 72-character limit.
    # This ensures the string passed to bcrypt is always 64 chars.
    pwd_bytes = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return pwd_context.hash(pwd_bytes)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Must use the same pre-hash logic to compare
    pwd_bytes = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return pwd_context.verify(pwd_bytes, hashed_password)

def create_access_token(data: dict):
    # Use timezone-aware UTC to avoid deprecation warnings
    expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        return None