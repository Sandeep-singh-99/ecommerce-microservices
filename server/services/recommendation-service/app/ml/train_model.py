import os
from ml.preprocessing import load_data, clean_product_data
from ml.feature_engineering import build_content_model
from ml.collaborative_filtering import build_collaborative_model

def train_all_models():
    """
    Main entry point to train all recommendation models.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    datasets_dir = os.path.join(base_dir, 'datasets')
    models_dir = os.path.join(base_dir, 'trained_models')
    
    products_path = os.path.join(datasets_dir, 'products.csv')
    interactions_path = os.path.join(datasets_dir, 'user_interactions.csv')
    ratings_path = os.path.join(datasets_dir, 'ratings.csv')
    
    print("Loading data...")
    products_df, interactions_df, ratings_df = load_data(products_path, interactions_path, ratings_path)
    
    print("Preprocessing product data...")
    clean_products = clean_product_data(products_df)
    
    print("Building content-based model...")
    build_content_model(clean_products, models_dir)
    
    print("Building collaborative filtering model...")
    build_collaborative_model(ratings_df, interactions_df, models_dir)
    
    print("All models trained successfully.")

if __name__ == "__main__":
    train_all_models()
