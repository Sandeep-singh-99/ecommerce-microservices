from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)

    order_number = Column(String, unique=True, nullable=False)

    total_amount = Column(Float, nullable=False)

    payment_status = Column(String, default="pending")
    # pending, paid, failed

    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(Integer, ForeignKey("orders.id"))

    product_id = Column(Integer, nullable=False)

    product_name = Column(String, nullable=False)

    product_image = Column(String)

    price = Column(Float, nullable=False)

    quantity = Column(Integer, nullable=False)

    subtotal = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
