from typing import List
import httpx
from core.config import settings
from utils.logger import logger

class ProductFetchService:
    @staticmethod
    async def fetch_products(skip: int = 0, limit: int = 100) -> List[dict]:
        """
        Fetches products from the external product-service.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{settings.PRODUCT_SERVICE_URL}",
                    params={"skip": skip, "limit": limit},
                    timeout=10.0
                )
                response.raise_for_status()
                return response.json()
        except httpx.RequestError as exc:
            logger.error(f"An error occurred while requesting {exc.request.url!r}.")
            return []
        except httpx.HTTPStatusError as exc:
            logger.error(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")
            return []
