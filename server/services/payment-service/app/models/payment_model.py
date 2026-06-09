from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from uuid import uuid4
from app.core.database import Base

class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    order_id = Column(String, nullable=False, index=True)
    checkout_id = Column(String, unique=True, nullable=False, index=True)
    
    amount = Column(Integer, nullable=False)  # stored in minor units (cents/paise)
    currency = Column(String, default="INR", nullable=False)
    status = Column(String, default="pending", nullable=False)  # pending, paid, failed, refunded
    
    transaction_id = Column(String, nullable=True)  # Populated when payment succeeds
    payment_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
