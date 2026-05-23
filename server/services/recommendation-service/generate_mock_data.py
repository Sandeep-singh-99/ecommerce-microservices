import os
import pandas as pd
import numpy as np

def generate_mock_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    datasets_dir = os.path.join(base_dir, 'datasets')
    
    os.makedirs(datasets_dir, exist_ok=True)
    
    products_path = os.path.join(datasets_dir, 'products.csv')
    interactions_path = os.path.join(datasets_dir, 'user_interactions.csv')
    ratings_path = os.path.join(datasets_dir, 'ratings.csv')
    
    if os.path.exists(products_path) and os.path.exists(interactions_path) and os.path.exists(ratings_path):
        print("Mock data already exists.")
        return
        
    print("Generating mock data...")
    
    # Products
    num_products = 50
    products_data = {
        'product_id': range(1, num_products + 1),
        'title': [f'Product {i}' for i in range(1, num_products + 1)],
        'category': np.random.choice(['Electronics', 'Clothing', 'Books', 'Home'], num_products),
        'tags': [' '.join(np.random.choice(['new', 'sale', 'popular', 'premium', 'budget'], 2)) for _ in range(num_products)]
    }
    pd.DataFrame(products_data).to_csv(products_path, index=False)
    
    # Interactions
    num_interactions = 500
    interactions_data = {
        'user_id': np.random.randint(1, 20, num_interactions),
        'product_id': np.random.randint(1, num_products + 1, num_interactions),
        'interaction_type': np.random.choice(['view', 'click', 'add_to_cart', 'purchase'], num_interactions, p=[0.5, 0.3, 0.15, 0.05]),
        'timestamp': pd.date_range(start='1/1/2026', periods=num_interactions, freq='H')
    }
    pd.DataFrame(interactions_data).to_csv(interactions_path, index=False)
    
    # Ratings
    num_ratings = 100
    ratings_data = {
        'user_id': np.random.randint(1, 20, num_ratings),
        'product_id': np.random.randint(1, num_products + 1, num_ratings),
        'rating': np.random.randint(1, 6, num_ratings),
        'timestamp': pd.date_range(start='1/1/2026', periods=num_ratings, freq='H')
    }
    pd.DataFrame(ratings_data).to_csv(ratings_path, index=False)
    
    print("Mock data generated successfully.")

if __name__ == "__main__":
    generate_mock_data()
