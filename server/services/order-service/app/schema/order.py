from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from enum import Enum


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"


class OrderItemBase(BaseModel):
    product_id: str
    product_name: str
    product_image: Optional[str] = None
    price: Decimal = Field(..., gt=0)  # Price must be greater than 0
    quantity: int = Field(..., gt=0)  # Quantity must be greater than
    subtotal: Decimal = Field(..., gt=0)  # Subtotal must be greater than 0

class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(OrderItemBase):
    id: str
    order_id: str
    class config:
        from_attributes = True


class OrderBase(BaseModel):
    user_id: int
    total_amount: Decimal = Field(..., max_digits=10, decimal_places=2)

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderResponse(OrderBase):
    id: str
    order_number: str
    payment_status: PaymentStatus
    status: str
    created_at: datetime
    items: List[OrderItemResponse] 

    class config:
        from_attributes = True  

class OrderStatusUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[PaymentStatus] = None