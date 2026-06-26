from fastapi import APIRouter, Request, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.model.payment import Payment, PaymentStatus
from app.schema.payment_schama import PaymentCreate, PaymentResponse
from app.db.db import get_db
from app.services.cashfree_service import create_cashfree_order
import hashlib
import hmac
import httpx
import os
from sqlalchemy import select

router = APIRouter()

ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL", "http://order-service:8000")

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


def verify_signature(body: bytes, signature: str):
    """
    Verify Cashfree webhook signature.
    """
    secret = os.getenv("CASHFREE_SECRET_KEY")

    generated_signature = hmac.new(
        secret.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature, generated_signature)


@router.post("/webhook")
async def cashfree_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    body = await request.body()

    signature = request.headers.get("x-webhook-signature")

    if not signature:
        raise HTTPException(
            status_code=400,
            detail="Missing webhook signature"
        )

    if not verify_signature(body, signature):
        raise HTTPException(
            status_code=401,
            detail="Invalid signature"
        )

    payload = await request.json()

    order = payload.get("data", {}).get("order", {})
    payment = payload.get("data", {}).get("payment", {})

    order_id = order.get("order_id")
    transaction_id = payment.get("cf_payment_id")
    payment_status = payment.get("payment_status")

    payment_obj = db.scalar(
        select(Payment).where(Payment.order_id == order_id)
    )

    if not payment_obj:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    payment_obj.transaction_id = transaction_id

    if payment_status == "SUCCESS":
        payment_obj.status = PaymentStatus.SUCCESS

    elif payment_status == "FAILED":
        payment_obj.status = PaymentStatus.FAILED

    else:
        payment_obj.status = PaymentStatus.PENDING

    db.commit()
    db.refresh(payment_obj)

    # Notify Order Service
    async with httpx.AsyncClient() as client:
        await client.patch(
            f"{ORDER_SERVICE_URL}/orders/{order_id}/payment-status",
            json={
                "payment_status": payment_obj.status.value
            }
        )

    return {
        "status": "success"
    }