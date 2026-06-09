from fastapi import APIRouter, Depends, status, Request, HTTPException
from sqlalchemy.orm import Session
import json
import logging

from app.core.database import get_db
from app.core.redis import redis_client, CACHE_TTL_PAYMENTS
from app.models.payment_model import PaymentTransaction
from app.schemas.payment_schema import CheckoutSessionCreate, CheckoutSessionResponse, PaymentVerifyResponse
from app.services.dodo_service import DodoService
from app.services.webhook_service import WebhookService

logger = logging.getLogger(__name__)

router = APIRouter()
dodo_service = DodoService()
webhook_service = WebhookService()

@router.post("/create", response_model=CheckoutSessionResponse)
async def create_checkout_session(
    checkout_data: CheckoutSessionCreate,
    db: Session = Depends(get_db)
):
    # Check if a checkout session already exists for this order
    existing_tx = db.query(PaymentTransaction).filter(PaymentTransaction.order_id == str(checkout_data.order_id)).first()
    if existing_tx and existing_tx.status == "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This order has already been paid."
        )

    # Initiate checkout via Dodo Service
    dodo_res = await dodo_service.create_checkout(
        order_id=str(checkout_data.order_id),
        amount_paise=checkout_data.amount,
        currency=checkout_data.currency
    )

    # Create transaction log
    if existing_tx:
        existing_tx.checkout_id = dodo_res["checkout_id"]
        existing_tx.payment_url = dodo_res["payment_url"]
        existing_tx.amount = checkout_data.amount
        existing_tx.currency = checkout_data.currency
        existing_tx.status = "pending"
    else:
        new_tx = PaymentTransaction(
            order_id=str(checkout_data.order_id),
            checkout_id=dodo_res["checkout_id"],
            amount=checkout_data.amount,
            currency=checkout_data.currency,
            status="pending",
            payment_url=dodo_res["payment_url"]
        )
        db.add(new_tx)

    db.commit()
    return CheckoutSessionResponse(
        payment_url=dodo_res["payment_url"],
        checkout_id=dodo_res["checkout_id"],
        status="pending"
    )

@router.get("/verify/{checkout_id}", response_model=PaymentVerifyResponse)
async def verify_payment(
    checkout_id: str,
    db: Session = Depends(get_db)
):
    # 1. Check Redis cache first
    cache_key = f"payment_verification:{checkout_id}"
    cached_verify = redis_client.get(cache_key)
    if cached_verify:
        logger.info(f"Redis cache hit for payment verification: {checkout_id}")
        return PaymentVerifyResponse(**json.loads(cached_verify))

    # 2. Database query
    tx = db.query(PaymentTransaction).filter(PaymentTransaction.checkout_id == checkout_id).first()
    if not tx:
        # Check by transaction_id if not found by checkout_id
        tx = db.query(PaymentTransaction).filter(PaymentTransaction.transaction_id == checkout_id).first()
        if not tx:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment transaction record not found"
            )

    # 3. Synchronize state with Dodo Payments gateway if it is still pending
    if tx.status == "pending" and not checkout_id.startswith("sess_mock_"):
        dodo_status_data = await dodo_service.get_checkout_status(tx.checkout_id)
        dodo_status = dodo_status_data.get("status")
        
        # completed, failed, etc.
        if dodo_status == "completed":
            tx.status = "paid"
            tx.transaction_id = dodo_status_data.get("payment_id") or tx.checkout_id
            # Notify order service
            from app.services.order_client import OrderClient
            await OrderClient().update_order_payment_status(tx.order_id, is_success=True)
        elif dodo_status in ["failed", "expired"]:
            tx.status = "failed"
            # Notify order service
            from app.services.order_client import OrderClient
            await OrderClient().update_order_payment_status(tx.order_id, is_success=False)
        db.commit()
        db.refresh(tx)

    response_data = PaymentVerifyResponse(
        payment_status=tx.status,
        transaction_id=tx.transaction_id,
        amount=tx.amount,
        order_id=tx.order_id
    )

    # 4. Cache response in Redis
    redis_client.setex(
        cache_key, 
        CACHE_TTL_PAYMENTS, 
        json.dumps(response_data.model_dump())
    )

    return response_data

@router.post("/webhook")
async def handle_payment_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    raw_payload = await request.body()
    headers = dict(request.headers)
    
    # Process signature check and trigger state changes
    result = await webhook_service.process_webhook(raw_payload, headers, db)
    return result
