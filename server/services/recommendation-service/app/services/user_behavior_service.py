from sqlalchemy.ext.asyncio import AsyncSession
from models.recommendation import UserInteraction, ProductRating
from schemas.recommendation_schema import InteractionCreate, RatingCreate
from utils.logger import logger

class UserBehaviorService:
    @staticmethod
    async def record_interaction(interaction: InteractionCreate, db: AsyncSession) -> UserInteraction:
        """
        Records a user interaction (click, view, purchase, etc.)
        """
        logger.info(f"Recording {interaction.interaction_type} for user {interaction.user_id} on product {interaction.product_id}")
        new_interaction = UserInteraction(
            user_id=interaction.user_id,
            product_id=interaction.product_id,
            interaction_type=interaction.interaction_type
        )
        db.add(new_interaction)
        await db.commit()
        await db.refresh(new_interaction)
        return new_interaction

    @staticmethod
    async def record_rating(rating: RatingCreate, db: AsyncSession) -> ProductRating:
        """
        Records a user rating for a product.
        """
        logger.info(f"Recording rating {rating.rating} for user {rating.user_id} on product {rating.product_id}")
        new_rating = ProductRating(
            user_id=rating.user_id,
            product_id=rating.product_id,
            rating=rating.rating
        )
        db.add(new_rating)
        await db.commit()
        await db.refresh(new_rating)
        return new_rating
