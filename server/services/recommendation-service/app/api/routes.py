from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from db.session import get_db
from schemas.recommendation_schema import (
    InteractionCreate, InteractionResponse,
    RatingCreate, RatingResponse,
    RecommendationResponse
)
from app.services.recommendation_service import RecommendationService
from app.services.user_behavior_service import UserBehaviorService
from app.services.ai_recommendation_service import ai_recommendation_service
from app.utils.logger import logger

router = APIRouter()

@router.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}

@router.get("/recommendations/user/{user_id}", response_model=List[RecommendationResponse], tags=["Recommendations"])
async def get_user_recommendations(user_id: int, limit: int = 5, db: AsyncSession = Depends(get_db)):
    """
    Get personalized product recommendations for a specific user.
    """
    try:
        recs = await RecommendationService.get_user_recommendations(user_id, db, limit)
        return recs
    except Exception as e:
        logger.error(f"Error fetching user recommendations: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/recommendations/ai/{user_id}", response_model=List[RecommendationResponse], tags=["Recommendations"])
async def get_ai_recommendations(user_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get personalized product recommendations using AI (Gemini + LangGraph).
    """
    try:
        recs = await ai_recommendation_service.get_ai_recommendations(user_id, db)
        return recs
    except Exception as e:
        logger.error(f"Error fetching AI recommendations: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/recommendations/product/{product_id}", response_model=List[RecommendationResponse], tags=["Recommendations"])
async def get_product_recommendations(product_id: int, limit: int = 5, db: AsyncSession = Depends(get_db)):
    """
    Get similar products for a specific product (Content-based).
    """
    try:
        recs = await RecommendationService.get_product_recommendations(product_id, db, limit)
        return recs
    except Exception as e:
        logger.error(f"Error fetching product recommendations: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/interactions", response_model=InteractionResponse, tags=["User Behavior"])
async def record_interaction(interaction: InteractionCreate, db: AsyncSession = Depends(get_db)):
    """
    Record a user interaction event (e.g., click, view, add_to_cart, purchase).
    """
    try:
        return await UserBehaviorService.record_interaction(interaction, db)
    except Exception as e:
        logger.error(f"Error recording interaction: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/ratings", response_model=RatingResponse, tags=["User Behavior"])
async def record_rating(rating: RatingCreate, db: AsyncSession = Depends(get_db)):
    """
    Record a user rating for a product.
    """
    try:
        return await UserBehaviorService.record_rating(rating, db)
    except Exception as e:
        logger.error(f"Error recording rating: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
