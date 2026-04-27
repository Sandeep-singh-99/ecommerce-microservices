from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
from app.db.db import base

class Comment(base):
    __tablename__ = 'comments'

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    user_email = Column(String, nullable=False, index=True)
    product_id = Column(String, nullable=False, index=True)
    rating = Column(Float, nullable=False)
    comment_text = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)