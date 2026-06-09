import time
import random
from decimal import Decimal
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import logging

from app.model.order import Order, OrderItem, PaymentStatus
from app.schema.order import OrderStatusUpdate
from app.services.cart_client import CartClient
from app.services.product_client import ProductClient

logger = logging.getLogger(__name__)

def generate_order_number() -> str:
    timestamp = time.strftime('%Y%m%d%H%M%S')
    rand_seq = random.randint(1000, 9999)
    return f"ORD-{timestamp}-{rand_seq}"

class OrderService:
    def __init__(self):
        self.cart_client = CartClient()
        self.product_client = ProductClient()

    async def create_order(self, user_id: str, access_token: str, db: Session) -> Order:
        # 1. Fetch cart items from Cart Service
        cart_data = await self.cart_client.get_cart_items(access_token)
        cart_products = cart_data.get("products", [])
        
        if not cart_products:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Cannot place order. Your shopping cart is empty."
            )

        # 2. Extract product IDs and fetch details from Product Service to validate
        product_ids = [str(item["product_id"]) for item in cart_products]
        products_details = await self.product_client.get_products_batch(product_ids)
        product_map = {str(p["id"]): p for p in products_details}

        # 3. Validate products exist and compute prices and totals
        order_items_to_create = []
        total_amount = Decimal("0.00")

        for cart_item in cart_products:
            prod_id = str(cart_item["product_id"])
            if prod_id not in product_map:
                logger.error(f"Product ID {prod_id} found in cart but not in Product Service catalog")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"Product with ID {prod_id} is no longer available."
                )
            
            product_info = product_map[prod_id]
            # Use sales_price if available, otherwise regular price
            price = Decimal(str(product_info.get("sales_price") or product_info.get("price") or 0))
            quantity = int(cart_item["quantity"])
            subtotal = price * quantity
            total_amount += subtotal

            # Extract primary image URL if any
            image_url = None
            if "image" in product_info and product_info["image"]:
                image_url = product_info["image"].get("url")
            elif "images" in product_info and product_info["images"]:
                # Fallback to images list if batch returned detailed object
                primary = next((img for img in product_info["images"] if img.get("is_primary")), None)
                if not primary and len(product_info["images"]) > 0:
                    primary = product_info["images"][0]
                image_url = primary.get("url") if primary else None

            order_item = OrderItem(
                product_id=prod_id,
                product_name=product_info.get("name") or "Unknown Product",
                product_image=image_url,
                price=price,
                quantity=quantity,
                subtotal=subtotal
            )
            order_items_to_create.append(order_item)

        # 4. Generate order details
        order_number = generate_order_number()
        db_order = Order(
            user_id=user_id,
            order_number=order_number,
            total_amount=total_amount,
            payment_status=PaymentStatus.PENDING,
            status="pending"
        )
        
        db.add(db_order)
        db.flush()  # Gets the auto-generated order UUID

        # Associate items with the order
        for item in order_items_to_create:
            item.order_id = db_order.id
            db.add(item)

        db.commit()
        db.refresh(db_order)

        # 5. Async clear cart (non-blocking for response if fails, but we await it)
        try:
            await self.cart_client.clear_cart(access_token)
        except Exception as e:
            logger.warning(f"Order created successfully but failed to clear cart: {e}")

        return db_order

    def get_user_orders(self, user_id: str, db: Session) -> List[Order]:
        return db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()

    def get_order_details(self, order_id: str, user_id: str, user_role: str, db: Session) -> Order:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Order not found"
            )
        
        # Security check: only order owner or admins can fetch details
        if order.user_id != user_id and user_role != "ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You do not have permission to view this order"
            )
        
        return order

    def update_order_status(self, order_id: str, status_update: OrderStatusUpdate, db: Session) -> Order:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Order not found"
            )

        if status_update.payment_status is not None:
            order.payment_status = status_update.payment_status

        if status_update.status is not None:
            valid_statuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"]
            if status_update.status not in valid_statuses:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid status. Choose from: {', '.join(valid_statuses)}"
                )
            order.status = status_update.status

        db.commit()
        db.refresh(order)
        return order

    def cancel_order(self, order_id: str, user_id: str, user_role: str, db: Session) -> Order:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Order not found"
            )

        # Only owner or admin can cancel
        if order.user_id != user_id and user_role != "ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You do not have permission to cancel this order"
            )

        # Cannot cancel delivered orders
        if order.status == "delivered":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Cannot cancel an order that has already been delivered"
            )

        order.status = "cancelled"
        order.payment_status = PaymentStatus.FAILED  # Or keep it, but set payment to failed if pending
        
        db.commit()
        db.refresh(order)
        return order
