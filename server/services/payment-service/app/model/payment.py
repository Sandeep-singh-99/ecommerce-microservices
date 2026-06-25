from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from uuid import uuid4
import enum

from app.db.db import Base

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"

class Payment(Base):
    __tablename__ = "payments"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid4())
    )

    order_id = Column(String, nullable=False, index=True)

    user_id = Column(String, nullable=False)

    amount = Column(
        Numeric(10, 2),
        nullable=False
    )

    provider = Column(
        String,
        default="dodo"
    )

    transaction_id = Column(
        String,
        unique=True,
        nullable=True
    )

    payment_link = Column(
        String,
        nullable=True
    )

    status = Column(
        Enum(PaymentStatus),
        default=PaymentStatus.PENDING
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )