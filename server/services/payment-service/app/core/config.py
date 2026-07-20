import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL_PAYMENT_SERVICE")
CASHFREE_APP_ID = os.getenv("CASHFREE_APP_ID", "TEST_APP_ID")
CASHFREE_SECRET_KEY = os.getenv("CASHFREE_SECRET_KEY", "TEST_SECRET_KEY")
CASHFREE_BASE_URL = os.getenv("CASHFREE_BASE_URL", "https://sandbox.cashfree.com/pg").rstrip("/")
CASHFREE_API_VERSION = os.getenv("CASHFREE_API_VERSION", "2023-08-01")

ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL", "http://order-service:8000").rstrip("/")
CART_SERVICE_URL = os.getenv("CART_SERVICE_URL", "http://cart-service:8000").rstrip("/")
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://user-service:8000").rstrip("/")
