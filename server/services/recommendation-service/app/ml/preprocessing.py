import pandas as pd
import numpy as np
from typing import Tuple

def load_data(products_path: str, interactions_path: str, ratings_path: str) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Loads data from CSV files.
    """
    try:
        products_df = pd.read_csv(products_path)
    except FileNotFoundError:
        products_df = pd.DataFrame(columns=['product_id', 'title', 'category', 'tags'])
        
    try:
        interactions_df = pd.read_csv(interactions_path)
    except FileNotFoundError:
        interactions_df = pd.DataFrame(columns=['user_id', 'product_id', 'interaction_type', 'timestamp'])
        
    try:
        ratings_df = pd.read_csv(ratings_path)
    except FileNotFoundError:
        ratings_df = pd.DataFrame(columns=['user_id', 'product_id', 'rating', 'timestamp'])
        
    return products_df, interactions_df, ratings_df

def clean_product_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans and preprocesses product data for content-based filtering.
    Fills missing values in tags and categories.
    """
    if df.empty:
        return df
        
    df = df.copy()
    df['category'] = df['category'].fillna('')
    df['tags'] = df['tags'].fillna('')
    
    # Create a combined 'content' column for TF-IDF
    df['content'] = df['category'] + ' ' + df['tags']
    return df
