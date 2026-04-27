from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class CreateReview(BaseModel):
    product_id: str = Field(...)
    user_id: str = Field(...)
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: str = Field(...)
    product_id: str = Field(...)
    user_id: str = Field(...)
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    created_at: str = Field(...)
    updated_at: str = Field(...)

    class Config:
        from_attributes = True


class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = None

class ReviewDelete(BaseModel):
    id: str = Field(...)


class ReviewListResponse(BaseModel):
    reviews: list[ReviewResponse] = Field(...)

