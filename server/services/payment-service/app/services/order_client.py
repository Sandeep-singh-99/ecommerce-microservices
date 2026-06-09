import httpx
import os
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL", "http://order-service:8000")

class OrderClient:
    def __init__(self):
        self.base_url = f"{ORDER_SERVICE_URL}/api/v1/orders"

    async def update_order_payment_status(self, order_id: str, is_success: bool, is_refund: bool = False) -> bool:
        """
        Notify Order Service of the payment result.
        - If success: set status to 'paid' and payment_status to 'paid'.
        - If refund: set status to 'cancelled' and payment_status to 'failed' (or keep paid, but status cancelled).
        - If fail: set status to 'cancelled' and payment_status to 'failed'.
        """
        if is_success:
            payload = {
                "status": "paid",
                "payment_status": "paid"
            }
        elif is_refund:
            payload = {
                "status": "cancelled",
                "payment_status": "failed"
            }
        else:
            payload = {
                "status": "cancelled",
                "payment_status": "failed"
            }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.patch(f"{self.base_url}/{order_id}", json=payload, timeout=10.0)
                if response.status_code != 200:
                    logger.error(f"Failed to update Order Service status. Status code: {response.status_code}, Response: {response.text}")
                    return False
                logger.info(f"Successfully notified Order Service of payment status change for order: {order_id}")
                return True
            except httpx.RequestError as e:
                logger.error(f"Connection error to Order Service for updating payment: {e}")
                # We return False but should raise warning or retry queue in production
                return False
