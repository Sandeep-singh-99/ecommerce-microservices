import httpx
import os
from fastapi import HTTPException, status
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://product-service:8000")

class ProductClient:
    def __init__(self):
        self.base_url = f"{PRODUCT_SERVICE_URL}/api/products"

    async def get_products_batch(self, product_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Validate products by calling the product service batch endpoint POST /find-products.
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(f"{self.base_url}/find-products", json=product_ids, timeout=10.0)
                if response.status_code != 200:
                    logger.error(f"Product Service returned status {response.status_code}: {response.text}")
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY, 
                        detail="Failed to retrieve product details from Product Service"
                    )
                data = response.json()
                return data.get("products", [])
            except httpx.RequestError as e:
                logger.error(f"Failed to connect to Product Service: {e}")
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
                    detail="Product Service is unavailable"
                )
