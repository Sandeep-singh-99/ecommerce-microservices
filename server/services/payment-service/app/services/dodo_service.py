from dodopayments import AsyncDodoPayments
import os
from fastapi import HTTPException, status
import logging
import json

from app.core.config import DODO_API_KEY, DODO_ENV
from app.core.redis import redis_client, CACHE_TTL_PAYMENTS

logger = logging.getLogger(__name__)

class DodoService:
    def __init__(self):
        # Dodo Payments SDK environment parameter maps to "test_mode" or "live_mode"
        env = "test_mode" if DODO_ENV == "sandbox" else "live_mode"
        # Fallback bearer token if not provided (to avoid crash on import)
        token = DODO_API_KEY or "dummy_key_for_dev"
        self.client = AsyncDodoPayments(
            bearer_token=token,
            environment=env
        )

    async def create_checkout(self, order_id: str, amount_paise: int, currency: str = "INR") -> dict:
        """
        Creates a checkout session in Dodo Payments.
        """
        # If no key is set, simulate a successful mock checkout session to allow local developers to test
        if not DODO_API_KEY or DODO_API_KEY == "dummy_key_for_dev":
            logger.warning("DODO_API_KEY is not set. Simulating a mock checkout session.")
            mock_session_id = f"sess_mock_{order_id}_{int(amount_paise)}"
            mock_data = {
                "checkout_id": mock_session_id,
                "payment_url": f"http://localhost/payments/mock-checkout?session_id={mock_session_id}",
                "status": "pending"
            }
            # Cache mock session in Redis
            redis_client.setex(
                f"checkout_session:{mock_session_id}", 
                CACHE_TTL_PAYMENTS, 
                json.dumps(mock_data)
            )
            return mock_data

        try:
            # Create a Dodo checkout session
            # Note: Dodo Payments requires a product_id. We use a generic product name or ID.
            # In sandbox/test environment, you can use any dummy product_id like 'pdt_default'.
            response = await self.client.checkout_sessions.create(
                product_cart=[
                    {
                        "product_id": os.getenv("DODO_PRODUCT_ID", "pdt_default"),
                        "quantity": 1,
                        "amount": amount_paise
                    }
                ],
                customer={
                    "email": "buyer@ecommerce-microservices.com",
                    "name": "E-Commerce Buyer"
                },
                metadata={
                    "order_id": order_id
                },
                # Redirect user back to local client success page
                return_url=os.getenv("PAYMENT_RETURN_URL", "http://localhost:5173/payment-success")
            )
            
            result = {
                "checkout_id": response.session_id,
                "payment_url": response.checkout_url,
                "status": "pending"
            }
            
            # Cache in Redis for fast verification and checkouts
            redis_client.setex(
                f"checkout_session:{response.session_id}", 
                CACHE_TTL_PAYMENTS, 
                json.dumps(result)
            )
            
            return result
        except Exception as e:
            logger.error(f"Error creating Dodo Payments checkout session: {e}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Dodo Payments gateway error: {str(e)}"
            )

    async def get_checkout_status(self, checkout_id: str) -> dict:
        """
        Fetch checkout status from Dodo Payments gateway.
        """
        # Return mocked response if using sandbox/mock
        if checkout_id.startswith("sess_mock_"):
            cached = redis_client.get(f"checkout_session:{checkout_id}")
            if cached:
                return json.loads(cached)
            return {"checkout_id": checkout_id, "status": "pending"}

        try:
            response = await self.client.checkout_sessions.retrieve(checkout_id)
            return {
                "checkout_id": response.session_id,
                "status": response.status,  # e.g., 'completed', 'failed', 'expired'
                "payment_id": getattr(response, "payment_id", None)
            }
        except Exception as e:
            logger.error(f"Error fetching Dodo Payments checkout status: {e}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Dodo Payments retrieve error: {str(e)}"
            )
