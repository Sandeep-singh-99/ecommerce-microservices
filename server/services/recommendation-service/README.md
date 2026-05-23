# Recommendation Microservice

This microservice provides personalized product recommendations based on user interactions, ratings, and product metadata. It utilizes FastAPI for the API, PostgreSQL for event storage, and Scikit-Learn for collaborative and content-based filtering algorithms.

## Architecture

* **FastAPI**: Asynchronous web framework serving endpoints.
* **PostgreSQL**: Stores interaction logs and product ratings.
* **Scikit-Learn / Pandas**: Processes CSV datasets to compute TF-IDF similarity matrices and user-item interaction scores.
* **HTTPX**: Communicates with external microservices (e.g., `product-service`).

## Setup and Deployment

This service is fully dockerized and ready to be orchestrated with `docker-compose`.

### Prerequisites

* Docker
* Docker Compose

### Running the Service

1. Build and start the container (this will also spin up a PostgreSQL instance):
   ```bash
   docker compose up --build
   ```
2. The service automatically generates mock datasets and trains the machine learning models on first boot!
3. The API will be available at `http://localhost:8000`.
4. Swagger UI Documentation: `http://localhost:8000/docs`.

### API Endpoints Examples

#### 1. Get User Recommendations
```bash
curl -X GET "http://localhost:8000/api/v1/recommendations/user/5?limit=3"
```
**Response:**
```json
[
  {
    "product_id": 15,
    "score": 0.97,
    "reason": "Similar users interacted with this product"
  }
]
```

#### 2. Get Similar Products
```bash
curl -X GET "http://localhost:8000/api/v1/recommendations/product/10?limit=5"
```

#### 3. Record User Interaction
```bash
curl -X POST "http://localhost:8000/api/v1/interactions" \
     -H "Content-Type: application/json" \
     -d '{"user_id": 1, "product_id": 42, "interaction_type": "add_to_cart"}'
```

## Local Development (Without Docker)

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run mock data generation and training:
   ```bash
   python generate_mock_data.py
   python -m ml.train_model
   ```
4. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Model Training Notebook
To explore the inner workings of the recommendation engine interactively, check out `notebooks/model_training.ipynb`.
