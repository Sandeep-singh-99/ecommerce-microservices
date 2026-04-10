from pydantic import  BaseModel, EmailStr,Field
from typing import Optional
from fastapi import UploadFile


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str = None
    profile_picture: UploadFile = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    profile_picture_url: Optional[str] = None

    class Config:
        orm_mode = True

class UserLogout(BaseModel):
    pass