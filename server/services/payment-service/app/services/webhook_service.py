import hmac
import hashlib
import base64
import json
import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.config import DODO_WEBHOOK_SECRET
from app.core.redis import redis_client
from app.models.payment_model import PaymentTransaction
from app.services.order_client import OrderClient

logger = logging.getLogger(__name__)

class WebhookService:
    def __init__(self):
        self.order_client = OrderClient()

    def verify_signature(self, payload: bytes, headers: dict) -> bool:
        """
        Verify the webhook signature using Standard Webhooks spec manually for reliability.
        """
        secret = DODO_WEBHOOK_SECRET
        if not secret:
            logger.warning("DODO_WEBHOOK_SECRET is not configured. Webhook signature check is bypassed.")
            return True

        webhook_id = headers.get("webhook-id")
        webhook_timestamp = headers.get("webhook-timestamp")
        webhook_signature = headers.get("webhook-signature")

        if not (webhook_id and webhook_timestamp and webhook_signature):
            logger.error("Missing webhook signature headers")
            return False

        # Clean secret prefix
        if secret.startswith("whsec_"):
            secret = secret[6:]

        try:
            secret_bytes = base64.b64decode(secret)
        except Exception:
            # Fallback to UTF-8 bytes if not base64
            secret_bytes = secret.encode("utf-8")

        # The signature is computed over: "webhook-id.webhook-timestamp.payload"
        msg = f"{webhook_id}.{webhook_timestamp}.".encode("utf-8") + payload
        expected_signature = hmac.new(secret_bytes, msg, hashlib.sha256).digest()

        # Parse signatures from the header
        # E.g., webhook-signature: "v1,signature1 v1,signature2"
        for sig_item in webhook_signature.split(" "):
            if sig_item.startswith("v1,"):
                sig_b64 = sig_item[3:]
                try:
                    sig_bytes = base64.b64decode(sig_b64)
                    if hmac.compare_digest(sig_bytes, expected_signature):
                        return True
                except Exception:
                    continue

        logger.error("Webhook signature mismatch")
        return False

    async def process_webhook(self, raw_payload: bytes, headers: dict, db: Session) -> dict:
        """
        Process verified Dodo Payments webhook payload.
        """
        if not self.verify_signature(raw_payload, headers):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid webhook signature"
            )

        try:
            payload = json.loads(raw_payload)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON payload")

        event_type = payload.get("type")
        event_data = payload.get("data", {})
        
        # Sometimes standard webhooks wrap the event data in a 'data.object' block
        data_obj = event_data.get("object", event_data) if isinstance(event_data, dict) else event_data
        if not isinstance(data_obj, dict):
            data_obj = payload

        # Extract payment details
        payment_id = data_obj.get("payment_id")
        # Extract metadata
        metadata = data_obj.get("metadata", {})
        order_id = metadata.get("order_id") if isinstance(metadata, dict) else None
        
        logger.info(f"Received webhook {event_type} for payment_id: {payment_id}, order_id: {order_id}")

        if not order_id and payment_id:
            # Fallback: check database if order_id is not in metadata but checkout session was logged
            tx = db.query(PaymentTransaction).filter(
                (PaymentTransaction.checkout_id == payment_id) | 
                (PaymentTransaction.transaction_id == payment_id)
            ).first()
            if tx:
                order_id = tx.order_id

        if not order_id:
            logger.error(f"Cannot process webhook. Order ID could not be identified from metadata or transaction log.")
            return {"status": "ignored", "detail": "Missing order reference"}

        # Fetch transaction log
        tx = db.query(PaymentTransaction).filter(PaymentTransaction.order_id == str(order_id)).first()
        if not tx:
            # If transaction is not found but we received a hook, let's create a placeholder
            tx = PaymentTransaction(
                order_id=str(order_id),
                checkout_id=payment_id or f"placeholder_{order_id}",
                amount=data_obj.get("amount", 0),
                currency=data_obj.get("currency", "INR"),
                status="pending"
            )
            db.add(tx)
            db.flush()

        # Process by event types
        if event_type == "payment.succeeded":
            tx.status = "paid"
            tx.transaction_id = payment_id
            db.commit()
            
            # Notify Order Service
            await self.order_client.update_order_payment_status(str(order_id), is_success=True)
            
            # Invalidate Redis cache
            redis_client.delete(f"payment_verification:{tx.checkout_id}")
            redis_client.delete(f"payment_verification_by_order:{order_id}")
            
        elif event_type == "payment.failed":
            tx.status = "failed"
            tx.transaction_id = payment_id
            db.commit()
            
            # Notify Order Service
            await self.order_client.update_order_payment_status(str(order_id), is_success=False)
            
            # Invalidate Redis cache
            redis_client.delete(f"payment_verification:{tx.checkout_id}")
            redis_client.delete(f"payment_verification_by_order:{order_id}")
            
        elif event_type == "payment.refunded":
            tx.status = "refunded"
            db.commit()
            
            # Notify Order Service of refund (sets order to cancelled)
            await self.order_client.update_order_payment_status(str(order_id), is_success=False, is_refund=True)
            
            # Invalidate Redis cache
            redis_client.delete(f"payment_verification:{tx.checkout_id}")
            redis_client.delete(f"payment_verification_by_order:{order_id}")

        return {"status": "processed", "event": event_type, "order_id": order_id}
