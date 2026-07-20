from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from shared.security import decode_access_token
from fastapi import Request, HTTPException, status
from pydantic import BaseModel

# 1. Define a simple schema to hold what you extract from the token
class TokenData(BaseModel):
    email: str
    role: str
    user_id: str

    # If your JWT payload includes the user's ID, add it here too!
    # user_id: str 

# 2. The Shared Dependency (No Database Required!)
def get_current_user(request: Request) -> TokenData:
    # Extract the token from the cookie or Authorization header
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1].strip()
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Not authenticated"
        )
        
    try:
        # Decode the token
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token"
            )
        email = payload.get("sub")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token structure"
            )
            
        # Return the Pydantic schema
        user_id = str(payload.get("id") or payload.get("user_id") or "")
        return TokenData(email=email, role=payload.get("role", "USER"), user_id=user_id)
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or expired token"
        )