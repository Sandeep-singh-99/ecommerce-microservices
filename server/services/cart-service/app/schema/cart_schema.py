from pydantic import BaseModel, Field


class CartItem(BaseModel):
    user_id: str = Field(...)
    product_id: str = Field(...)
    quantity: int = Field(..., ge=1)
    price: float = Field(..., ge=0.0)


class CartItemResponse(CartItem):
    id: str = Field(...)
    created_at: str = Field(...)
    updated_at: str = Field(...)

    class Config:
        from_attributes = True


class CartItemDeleteRequest(BaseModel):
    id: str = Field(...)