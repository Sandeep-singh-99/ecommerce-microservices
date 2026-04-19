from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
# from app.db.database import get_db
# from app.models.user import User
from shared.security import decode_access_token
from fastapi import Request, HTTPException, status
from pydantic import BaseModel

# def get_current_user(request: Request, db: Session = Depends(get_db)):
#     token = request.cookies.get("access_token")
#     if not token:
#         raise HTTPException(status_code=401, detail="Not authenticated")
#     try:
#         payload = decode_access_token(token)
#         email = payload.get("sub")
#         if not email:
#             raise HTTPException(status_code=401, detail="Invalid token")
#         user = db.query(User).filter(User.email == email).first()
#         if not user:
#             raise HTTPException(status_code=401, detail="User not found")
#         return user
#     except Exception:
#         raise HTTPException(status_code=401, detail="Invalid or expired token")
    

# 1. Define a simple schema to hold what you extract from the token
class TokenData(BaseModel):
    email: str
    # If your JWT payload includes the user's ID, add it here too!
    # user_id: str 

# 2. The Shared Dependency (No Database Required!)
def get_current_user(request: Request) -> TokenData:
    # Extract the token from the cookie
    token = request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Not authenticated"
        )
        
    try:
        # Decode the token
        payload = decode_access_token(token)
        email = payload.get("sub")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token structure"
            )
            
        # Return the Pydantic schema, NOT the database model
        return TokenData(email=email)
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or expired token"
        )