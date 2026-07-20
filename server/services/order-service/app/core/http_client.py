import os
import httpx
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger("order_service.http_client")

PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://product-service:8000").rstrip("/")
PAYMENT_SERVICE_URL = os.getenv("PAYMENT_SERVICE_URL", "http://payment-service:5000").rstrip("/")
CART_SERVICE_URL = os.getenv("CART_SERVICE_URL", "http://cart-service:8000").rstrip("/")


class ServiceHTTPClient:
    """
    Reusable HTTP client for microservice-to-microservice calls using httpx.AsyncClient.
    """

    @staticmethod
    async def fetch_product_details(product_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetch product details from Product Service to validate existence, real price, and details.
        """
        url = f"{PRODUCT_SERVICE_URL}/api/products/find-product/{product_id}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    return response.json()
                logger.warning(f"Product Service returned status {response.status_code} for product_id={product_id}")
                return None
        except Exception as e:
            logger.error(f"Error fetching product_id={product_id} from Product Service: {e}")
            return None

    @staticmethod
    async def fetch_multiple_products(product_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Fetch multiple product details from Product Service.
        """
        url = f"{PRODUCT_SERVICE_URL}/api/products/find-products"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, json=product_ids)
                if response.status_code == 200:
                    data = response.json()
                    return data.get("products", [])
                logger.warning(f"Product Service find-products returned status {response.status_code}")
                return []
        except Exception as e:
            logger.error(f"Error fetching product list from Product Service: {e}")
            return []

    @staticmethod
    async def create_payment_order(payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Call Payment Service to initiate payment and generate Cashfree session link.
        Payload keys: order_id, user_id, amount, customer_name, customer_email, customer_phone
        """
        url = f"{PAYMENT_SERVICE_URL}/payments/create"
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(url, json=payload)
                if response.status_code in (200, 201):
                    return response.json()
                logger.error(f"Payment Service failed with status {response.status_code}: {response.text}")
                return {"error": f"Payment Service returned status {response.status_code}", "detail": response.text}
        except Exception as e:
            logger.error(f"Failed to connect to Payment Service: {e}")
            return {"error": "Failed to connect to Payment Service", "detail": str(e)}

    @staticmethod
    async def clear_user_cart(user_id: str) -> bool:
        """
        Call Cart Service to clear user's cart after successful order payment.
        """
        url = f"{CART_SERVICE_URL}/api/carts/user/{user_id}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.delete(url)
                return response.status_code == 200
        except Exception as e:
            logger.error(f"Failed to clear cart for user_id={user_id}: {e}")
            return False
