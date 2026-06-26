from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class PaymentCreate(BaseModel):
    order_id: str
    user_id: str
    amount: Decimal


class PaymentResponse(BaseModel):
    id: str
    order_id: str
    user_id: str
    amount: Decimal
    currency: str
    provider: str
    transaction_id: str | None
    payment_link: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 