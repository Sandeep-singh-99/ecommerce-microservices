from jose import JWTError, jwt
from shared.config import JWT_SECRET_KEY, ACCESS_TOKEN_EXPIRE_DAYS

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        return None