from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class CreateProduct(BaseModel):
    product_name: str = Field(..., min_length=3, max_length=100)
    product_brand: str = Field(..., min_length=3, max_length=100)
    product_price: float = Field(..., ge=0.0)
    sales_price: float = Field(..., ge=0.0)
    product_description: Optional[str] = None
    product_category: str = Field(..., min_length=3, max_length=100)

class ProductResponse(BaseModel):
    id: str = Field(...)
    product_name: str = Field(..., min_length=3, max_length=100)
    product_brand: str = Field(..., min_length=3, max_length=100)
    product_price: float = Field(..., ge=0.0)
    sales_price: float = Field(..., ge=0.0)
    product_description: Optional[str] = None
    product_category: str = Field(..., min_length=3, max_length=100)
    images: list[dict] = Field(...)
    created_at: str = Field(...)
    updated_at: str = Field(...)

    class Config:
        from_attributes = True

class CreateTrendingProduct(BaseModel):
    product_id: str = Field(...)

class TrendingProductResponse(ProductResponse):
    id: str = Field(...)
    created_at: str = Field(...)
    updated_at: str = Field(...)
    product_id: str = Field(...)

    class Config:
        from_attributes = True
    

