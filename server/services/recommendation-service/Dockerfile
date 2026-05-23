FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Generate mock data and train models on startup, then start uvicorn
CMD ["sh", "-c", "python generate_mock_data.py && python -m ml.train_model && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
