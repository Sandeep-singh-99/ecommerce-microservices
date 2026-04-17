FROM python:3.13-slim AS builder

WORKDIR /app

COPY services/product-service/requirements.txt .

RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

RUN find /install -type d -name "__pycache__" -exec rm -r {} + \
    && find /install -type f -name "*.pyc" -delete

FROM python:3.13-slim

WORKDIR /app

COPY --from=builder /install /usr/local

COPY services/product-service/app ./app
COPY shared ./shared

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
