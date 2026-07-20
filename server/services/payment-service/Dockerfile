FROM python:3.13-slim

# 1. Pull the uv binary directly from Astral's official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 2. Configure uv for a Docker environment
ENV UV_SYSTEM_PYTHON=1
ENV UV_COMPILE_BYTECODE=1

WORKDIR /app

# 3. Copy dependency files FIRST
COPY services/payment-service/requirements.txt .

# 4. Install dependencies
RUN uv pip install --no-cache -r requirements.txt

# 5. Copy shared utilities and app code
COPY shared ./shared
COPY services/payment-service/app ./app
COPY services/payment-service/alembic ./alembic
COPY services/payment-service/alembic.ini ./alembic.ini

EXPOSE 5000

# 6. Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]
