import httpx
import os
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

CART_SERVICE_URL = os.getenv("CART_SERVICE_URL", "http://cart-service:8000")

class CartClient:
    def __init__(self):
        self.base_url = f"{CART_SERVICE_URL}/api/carts"

    async def get_cart_items(self, access_token: str) -> dict:
        """
        Fetch cart items from the Cart Service using the user's access token cookie.
        """
        cookies = {"access_token": access_token}
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{self.base_url}/get-cart-items", cookies=cookies, timeout=10.0)
                if response.status_code == 401:
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized in Cart Service")
                if response.status_code != 200:
                    logger.error(f"Cart Service returned status {response.status_code}: {response.text}")
                    raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Failed to fetch cart items from Cart Service")
                
                return response.json()
            except httpx.RequestError as e:
                logger.error(f"Failed to connect to Cart Service: {e}")
                raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Cart Service is unavailable")

    async def clear_cart(self, access_token: str) -> dict:
        """
        Clear the user's cart in Cart Service.
        """
        cookies = {"access_token": access_token}
        async with httpx.AsyncClient() as client:
            try:
                response = await client.delete(f"{self.base_url}/clear-cart", cookies=cookies, timeout=10.0)
                if response.status_code != 200:
                    logger.error(f"Failed to clear cart, status {response.status_code}: {response.text}")
                    # Non-blocking, log error but don't fail the order if the cart clearing fails
                    return {"warning": "Could not clear cart"}
                return response.json()
            except httpx.RequestError as e:
                logger.error(f"Error connecting to Cart Service to clear cart: {e}")
                return {"warning": "Cart Service unavailable for clearing"}
