from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from app.models.user import userRole

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    user_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    user_name: Optional[str] = None
    profile_image: Optional[str] = None
    role: userRole

    class Config:
        from_attributes = True

class UserLogout(BaseModel):
    message: str