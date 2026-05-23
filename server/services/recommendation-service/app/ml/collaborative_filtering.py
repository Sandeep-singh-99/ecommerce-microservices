import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os

def build_collaborative_model(ratings_df: pd.DataFrame, interactions_df: pd.DataFrame, model_dir: str):
    """
    Builds a collaborative filtering model based on user ratings and interactions.
    """
    if ratings_df.empty and interactions_df.empty:
        print("Not enough user behavior data to build collaborative model.")
        return

    # Combine ratings and interactions into a single score
    # Implicit feedback from interactions (e.g., view=1, cart=3, purchase=5)
    # Explicit feedback from ratings (1-5)
    
    # Let's simplify and use ratings if available, else infer from interactions
    # Here we just use a basic user-item matrix
    
    df = pd.DataFrame(columns=['user_id', 'product_id', 'score'])
    
    if not ratings_df.empty:
        df = ratings_df[['user_id', 'product_id', 'rating']].rename(columns={'rating': 'score'})
        
    if not interactions_df.empty:
        interaction_weights = {'view': 1, 'click': 1, 'add_to_cart': 3, 'purchase': 5}
        interactions_df['score'] = interactions_df['interaction_type'].map(interaction_weights).fillna(1)
        int_df = interactions_df[['user_id', 'product_id', 'score']]
        df = pd.concat([df, int_df])
        
    # Aggregate scores (e.g., mean) if multiple entries per user-product exist
    user_item_df = df.groupby(['user_id', 'product_id'])['score'].mean().reset_index()
    
    # Create pivot table
    user_item_matrix = user_item_df.pivot(index='user_id', columns='product_id', values='score').fillna(0)
    
    if user_item_matrix.empty:
        print("User item matrix is empty.")
        return
        
    # Calculate user similarity
    user_similarity = cosine_similarity(user_item_matrix)
    user_similarity_df = pd.DataFrame(user_similarity, index=user_item_matrix.index, columns=user_item_matrix.index)
    
    # Save model
    os.makedirs(model_dir, exist_ok=True)
    with open(os.path.join(model_dir, 'user_similarity.pkl'), 'wb') as f:
        pickle.dump(user_similarity_df, f)
        
    with open(os.path.join(model_dir, 'user_item_matrix.pkl'), 'wb') as f:
        pickle.dump(user_item_matrix, f)
        
    print("Collaborative model built successfully.")
