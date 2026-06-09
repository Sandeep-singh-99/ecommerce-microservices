from pydantic import BaseModel, Field
from typing import Optional

class CheckoutSessionCreate(BaseModel):
    order_id: str = Field(..., description="The unique ID of the order")
    amount: int = Field(..., gt=0, description="The total amount in minor units (e.g. Paise for INR)")
    currency: str = Field("INR", description="Three-letter ISO currency code")

class CheckoutSessionResponse(BaseModel):
    payment_url: str
    checkout_id: str
    status: str

    class Config:
        from_attributes = True

class PaymentVerifyResponse(BaseModel):
    payment_status: str
    transaction_id: Optional[str] = None
    amount: int
    order_id: str

    class Config:
        from_attributes = True
