import os
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from ml.predict import RecommendationEngine
from models.recommendation import RecommendationLog
from schemas.recommendation_schema import RecommendationResponse
from utils.logger import logger

# Initialize engine singleton
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
models_dir = os.path.join(base_dir, 'trained_models')
engine = RecommendationEngine(models_dir)

class RecommendationService:
    @staticmethod
    async def get_user_recommendations(user_id: int, db: AsyncSession, limit: int = 5) -> List[RecommendationResponse]:
        """
        Gets personalized recommendations for a user.
        """
        logger.info(f"Fetching recommendations for user {user_id}")
        recs = engine.get_user_recommendations(user_id, top_n=limit)
        
        # Log the recommendations
        for rec in recs:
            log_entry = RecommendationLog(
                user_id=user_id,
                product_id=rec["product_id"],
                recommendation_type="collaborative",
                score=rec["score"]
            )
            db.add(log_entry)
        
        try:
            await db.commit()
        except Exception as e:
            logger.error(f"Failed to log recommendations: {e}")
            await db.rollback()
            
        return [RecommendationResponse(**r) for r in recs]

    @staticmethod
    async def get_product_recommendations(product_id: int, db: AsyncSession, limit: int = 5) -> List[RecommendationResponse]:
        """
        Gets similar products for a given product.
        """
        logger.info(f"Fetching similar products for product {product_id}")
        recs = engine.get_similar_products(product_id, top_n=limit)
        
        # We don't necessarily log product-to-product views unless tied to a user session.
        
        return [RecommendationResponse(**r) for r in recs]
