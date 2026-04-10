from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    user_name: Optional[str] = None
    profile_image: Optional[str] = None

    class Config:
        from_attributes = True

class UserLogout(BaseModel):
    pass