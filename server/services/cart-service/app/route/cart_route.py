from fastapi import APIRouter, Depends, status, Request, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.db import get_db
from app.schema.cart_schema import CartItem, CartItemResponse, CartItemDeleteRequest
from app.model.cart import Cart 
from shared.dependencies import get_current_user, TokenData
import httpx


router = APIRouter()

@router.post("/cart/items", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
async def add_cart_item(cart_item: CartItem, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    # Verify product exists by calling Product Service
    async with httpx.AsyncClient() as client:
        product_response = await client.get(f"http://product-service/products/{cart_item.product_id}")
        if product_response.status_code != 200:
            return {"error": "Product not found"}, status.HTTP_404_NOT_FOUND

    new_cart_item = Cart(
        user_id=current_user.user_id,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity,
        price=cart_item.price
    )
    db.add(new_cart_item)
    db.commit()
    db.refresh(new_cart_item)
    return CartItemResponse.from_orm(new_cart_item)