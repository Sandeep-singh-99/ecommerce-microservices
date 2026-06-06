# # Stage 1: builder
# FROM python:3.13-slim AS builder

# WORKDIR /app

# # COPY requirements.txt .
# COPY services/user-service/requirements.txt .
# # RUN pip install -r requirements.txt
# RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# # Remove cache
# RUN find /usr/local -type d -name "__pycache__" -exec rm -r {} + \
#  && find /usr/local -type f -name "*.pyc" -delete

# # Stage 2: final image

# FROM python:3.13-slim

# WORKDIR /app

# COPY --from=builder /install /usr/local

# # COPY . .
# COPY services/user-service/app ./app
# COPY shared ./shared

# EXPOSE 8000

# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]


FROM python:3.13-slim

# 1. Pull the uv binary directly from Astral's official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 2. Configure uv for a Docker environment
ENV UV_SYSTEM_PYTHON=1
ENV UV_COMPILE_BYTECODE=1

WORKDIR /app

# 3. Copy dependency files FIRST (Optimizes Docker layer caching)
# If you fully switched to pyproject.toml, copy that instead of requirements.txt
COPY services/user-service/requirements.txt .

# 4. Install dependencies instantly
RUN uv pip install --no-cache -r requirements.txt

# 5. Copy the shared utilities and the actual app code
COPY shared ./shared
COPY services/user-service/app ./app

EXPOSE 8000

# 6. Run the application
# Note: I removed `--reload`. You should never use `--reload` in a Docker container 
# meant for deployment, as it consumes heavy resources tracking file changes.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]