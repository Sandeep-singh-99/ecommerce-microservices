from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.schema.order import OrderResponse, OrderStatusUpdate
from app.services.order_service import OrderService
from shared.dependencies import get_current_user, TokenData

router = APIRouter()
order_service = OrderService()

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    request: Request,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Extract access token cookie to forward to other services
    access_token = request.cookies.get("access_token")
    return await order_service.create_order(
        user_id=current_user.user_id,
        access_token=access_token,
        db=db
    )

@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure user_id is passed as string
    return order_service.get_user_orders(user_id=str(current_user.user_id), db=db)

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return order_service.get_order_details(
        order_id=order_id,
        user_id=str(current_user.user_id),
        user_role=current_user.role,
        db=db
    )

@router.patch("/{order_id}", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db)
):
    # Typically called internally by Payment Service webhook or Admin panel
    return order_service.update_order_status(
        order_id=order_id,
        status_update=status_update,
        db=db
    )

@router.post("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(
    order_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return order_service.cancel_order(
        order_id=order_id,
        user_id=str(current_user.user_id),
        user_role=current_user.role,
        db=db
    )
