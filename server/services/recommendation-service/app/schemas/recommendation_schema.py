from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class InteractionCreate(BaseModel):
    user_id: int
    product_id: int
    interaction_type: str = Field(..., description="Type of interaction: click, view, add_to_cart, purchase")

class InteractionResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    interaction_type: str
    timestamp: datetime

    class Config:
        from_attributes = True

class RatingCreate(BaseModel):
    user_id: int
    product_id: int
    rating: float = Field(..., ge=1.0, le=5.0, description="Rating between 1 and 5")

class RatingResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    rating: float
    timestamp: datetime

    class Config:
        from_attributes = True

class RecommendationResponse(BaseModel):
    product_id: int
    score: float
    reason: str

class RecommendationList(BaseModel):
    recommendations: List[RecommendationResponse]
