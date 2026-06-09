import httpx
import os
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

PAYMENT_SERVICE_URL = os.getenv("PAYMENT_SERVICE_URL", "http://payment-service:8000")

class PaymentClient:
    def __init__(self):
        self.base_url = f"{PAYMENT_SERVICE_URL}/payments"

    async def create_checkout_session(self, order_id: str, amount_paise: int, currency: str = "INR") -> dict:
        """
        Notify/Request payment service to create a checkout session for this order.
        """
        async with httpx.AsyncClient() as client:
            try:
                payload = {
                    "order_id": order_id,
                    "amount": amount_paise,
                    "currency": currency
                }
                response = await client.post(f"{self.base_url}/create", json=payload, timeout=10.0)
                if response.status_code != 200:
                    logger.error(f"Payment Service returned status {response.status_code}: {response.text}")
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY, 
                        detail="Failed to initiate payment checkout session"
                    )
                return response.json()
            except httpx.RequestError as e:
                logger.error(f"Failed to connect to Payment Service: {e}")
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
                    detail="Payment Service is unavailable"
                )
