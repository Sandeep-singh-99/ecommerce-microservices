import os
import httpx
from dotenv import load_dotenv

load_dotenv()


CASHFREE_CLIENT_ID = os.getenv("CASHFREE_APP_ID")
CASHFREE_CLIENT_SECRET = os.getenv("CASHFREE_SECRET_KEY")
CASHFREE_BASE_URL = os.getenv(
    "CASHFREE_BASE_URL",
    "https://sandbox.cashfree.com/pg"
)

async def create_cashfree_order(
    order_id: str,
    amount: float,
    customer_id: str,
    customer_name: str,
    customer_email: str,
    customer_phone: str,
):
    payload = {
        "order_id": order_id,
        "order_amount": amount,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": customer_id,
            "customer_name": customer_name,
            "customer_email": customer_email,
            "customer_phone": customer_phone
        }
    }

    headers = {
        "x-client-id": CASHFREE_CLIENT_ID,
        "x-client-secret": CASHFREE_CLIENT_SECRET,
        "x-api-version": "2025-01-01",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{CASHFREE_BASE_URL}/orders",
            json=payload,
            headers=headers
        )

    response.raise_for_status()
    return response.json()