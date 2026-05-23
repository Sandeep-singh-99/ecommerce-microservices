from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from db.database import Base

class UserInteraction(Base):
    """
    Stores user interaction events like clicks, views, add_to_cart, purchases.
    """
    __tablename__ = "user_interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    product_id = Column(Integer, index=True, nullable=False)
    interaction_type = Column(String, index=True, nullable=False) # e.g., 'click', 'view', 'add_to_cart', 'purchase'
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class ProductRating(Base):
    """
    Stores user ratings for products.
    """
    __tablename__ = "product_ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    product_id = Column(Integer, index=True, nullable=False)
    rating = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class RecommendationLog(Base):
    """
    Stores logs of recommendations provided to users.
    """
    __tablename__ = "recommendation_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    product_id = Column(Integer, index=True, nullable=False)
    recommendation_type = Column(String, nullable=False) # e.g., 'collaborative', 'content-based'
    score = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
