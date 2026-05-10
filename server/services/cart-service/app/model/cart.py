from sqlalchemy import Column, Integer, String, Float
from uuid import uuid4
from app.db.db import Base
from datetime import datetime


class Cart(Base):
    __tablename__ = 'carts'

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String, nullable=False)
    product_id = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat(), onupdate=lambda: datetime.utcnow().isoformat())