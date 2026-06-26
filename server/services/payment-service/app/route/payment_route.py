from fastapi import APIRouter, requests, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.model.payment import Payment, PaymentStatus
from app.schema.payment_schama import PaymentCreate, PaymentResponse
from app.db.db import get_db
from app.services.cashfree_service import create_cashfree_order


router = APIRouter()

@router.post("/create")
async def create_payment(
    payload: PaymentCreate,
    db: Session = Depends(get_db)
):
    cashfree_response = await create_cashfree_order(
        order_id=payload.order_id,
        amount=payload.amount,
        customer_id=payload.user_id,
        customer_name=payload.customer_name,
        customer_email=payload.customer_email,
        customer_phone=payload.customer_phone,
    )

    payment = Payment(
        order_id=payload.order_id,
        user_id=payload.user_id,
        amount=payload.amount,
        provider="cashfree",
        transaction_id=cashfree_response["cf_order_id"],
        status="pending"
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return {
        "payment_id": payment.id,
        "cf_order_id": cashfree_response["cf_order_id"],
        "payment_session_id": cashfree_response["payment_session_id"]
    }