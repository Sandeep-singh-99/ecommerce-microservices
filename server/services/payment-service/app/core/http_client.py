import logging
import httpx
from app.core.config import ORDER_SERVICE_URL, CART_SERVICE_URL

logger = logging.getLogger(__name__)


class ServiceHTTPClient:
    @staticmethod
    async def notify_order_service(order_id: str, status: str, transaction_id: str = None) -> bool:
        url = f"{ORDER_SERVICE_URL}/orders/{order_id}/payment-status"
        payload = {
            "status": status,
            "transaction_id": transaction_id
        }
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.patch(url, json=payload)
            if response.status_code == 200:
                logger.info(f"[Payment -> Order] Updated order_id={order_id} status to {status}")
                return True
            else:
                logger.error(f"[Payment -> Order] Failed updating order_id={order_id}: {response.text}")
                return False
        except Exception as e:
            logger.error(f"[Payment -> Order] Exception notifying order_id={order_id}: {e}")
            return False

    @staticmethod
    async def clear_user_cart(user_id: str) -> bool:
        url = f"{CART_SERVICE_URL}/api/carts/user/{user_id}"
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.delete(url)
            if response.status_code == 200:
                logger.info(f"[Payment -> Cart] Cleared cart for user_id={user_id}")
                return True
            else:
                logger.error(f"[Payment -> Cart] Failed clearing cart for user_id={user_id}: {response.text}")
                return False
        except Exception as e:
            logger.error(f"[Payment -> Cart] Exception clearing cart for user_id={user_id}: {e}")
            return False
