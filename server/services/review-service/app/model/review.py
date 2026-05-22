from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
from app.db.db import Base

class Comment(Base):
    __tablename__ = 'comments'

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    user_id = Column(String, nullable=False, index=True)
    product_id = Column(String, nullable=False, index=True)
    rating = Column(Float, nullable=False)
    comment_text = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)