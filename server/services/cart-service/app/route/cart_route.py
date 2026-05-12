from fastapi import APIRouter, Depends, status, Request, Query, Form, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.db import get_db
from app.schema.cart_schema import CartItem, CartItemResponse, CartItemDeleteRequest
from app.model.cart import Cart 
from shared.dependencies import get_current_user, TokenData
import httpx


router = APIRouter()

@router.post("/add-cart-item")
async def add_cart_item(
    cart_item: CartItem,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):

    # VERIFY PRODUCT
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://product-service:8000/find-product/{cart_item.product_id}"
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product_data = response.json()

    # CHECK EXISTING ITEM
    existing_item = (
        db.query(Cart)
        .filter(
            Cart.user_id == current_user.user_id,
            Cart.product_id == cart_item.product_id
        )
        .first()
    )

    # UPDATE QUANTITY
    if existing_item:
        existing_item.quantity += cart_item.quantity

        db.commit()
        db.refresh(existing_item)

        return {
            "message": "Cart updated",
            "cart": existing_item
        }

    # CREATE NEW ITEM
    new_cart_item = Cart(
        user_id=current_user.user_id,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity,
        price=product_data["sales_price"]
    )

    db.add(new_cart_item)

    db.commit()
    db.refresh(new_cart_item)

    return {
        "message": "Item added to cart",
        "cart": new_cart_item
    }


@router.get("/get-cart-items")
async def get_cart_items(
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):

    cart_items = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.user_id)
        .all()
    )

    if not cart_items:
        return {
            "products": []
        }

    product_ids = [str(item.product_id) for item in cart_items]

    # FETCH PRODUCTS FROM PRODUCT SERVICE
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://product-service:8000/find-products",
            json=product_ids
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch products"
        )

    products = response.json()["products"]

    # MAP PRODUCT ID -> PRODUCT
    product_map = {
        product["id"]: product
        for product in products
    }

    result = []

    total_price = 0

    for item in cart_items:
        product = product_map.get(str(item.product_id))

        if not product:
            continue

        subtotal = item.quantity * item.price
        total_price += subtotal

        result.append({
            "cart_id": item.id,
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price": item.price,
            "subtotal": subtotal,
            "product": product
        })

    return {
        "total_items": len(result),
        "total_price": total_price,
        "products": result
    }