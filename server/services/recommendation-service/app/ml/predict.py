import os
import pickle
import pandas as pd
import numpy as np
from typing import List, Dict, Any

class RecommendationEngine:
    def __init__(self, model_dir: str):
        self.model_dir = model_dir
        self.vectorizer = None
        self.similarity_matrix = None
        self.product_mapping = None
        self.user_similarity = None
        self.user_item_matrix = None
        self.load_models()

    def load_models(self):
        try:
            with open(os.path.join(self.model_dir, 'vectorizer.pkl'), 'rb') as f:
                self.vectorizer = pickle.load(f)
            with open(os.path.join(self.model_dir, 'similarity_matrix.pkl'), 'rb') as f:
                self.similarity_matrix = pickle.load(f)
            with open(os.path.join(self.model_dir, 'product_mapping.pkl'), 'rb') as f:
                self.product_mapping = pickle.load(f)
        except FileNotFoundError:
            print("Content models not found.")
            
        try:
            with open(os.path.join(self.model_dir, 'user_similarity.pkl'), 'rb') as f:
                self.user_similarity = pickle.load(f)
            with open(os.path.join(self.model_dir, 'user_item_matrix.pkl'), 'rb') as f:
                self.user_item_matrix = pickle.load(f)
        except FileNotFoundError:
            print("Collaborative models not found.")

    def get_similar_products(self, product_id: int, top_n: int = 5) -> List[Dict[str, Any]]:
        """Content-based filtering: recommend similar products"""
        if self.similarity_matrix is None or self.product_mapping is None:
            return []
            
        # Reverse mapping: product_id to index
        rev_mapping = {v: k for k, v in self.product_mapping.items()}
        
        if product_id not in rev_mapping:
            return []
            
        idx = rev_mapping[product_id]
        
        # Get pairwise similarity scores
        sim_scores = list(enumerate(self.similarity_matrix[idx]))
        
        # Sort based on similarity
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Get top N similar products (excluding itself)
        sim_scores = sim_scores[1:top_n+1]
        
        recommendations = []
        for i, score in sim_scores:
            rec_prod_id = self.product_mapping[i]
            recommendations.append({
                "product_id": int(rec_prod_id),
                "score": float(score),
                "reason": "Similar product based on content"
            })
            
        return recommendations

    def get_user_recommendations(self, user_id: int, top_n: int = 5) -> List[Dict[str, Any]]:
        """Collaborative filtering: recommend based on similar users"""
        if self.user_similarity is None or self.user_item_matrix is None:
            return []
            
        if user_id not in self.user_similarity.index:
            # Cold start: fallback to popular products (omitted for brevity)
            return []
            
        # Get similar users
        sim_users = self.user_similarity[user_id].sort_values(ascending=False).drop(user_id)
        
        # Get items the user hasn't interacted with
        user_items = self.user_item_matrix.loc[user_id]
        unseen_items = user_items[user_items == 0].index
        
        # Calculate predicted scores for unseen items
        item_scores = {}
        for item in unseen_items:
            # Weighted average of ratings from similar users who rated the item
            item_ratings = self.user_item_matrix[item]
            # Filter users who interacted with the item
            users_with_interaction = item_ratings[item_ratings > 0].index
            
            # Intersection of similar users and users with interaction
            relevant_users = sim_users.index.intersection(users_with_interaction)
            
            if len(relevant_users) > 0:
                score = np.average(item_ratings[relevant_users], weights=sim_users[relevant_users])
                item_scores[item] = score
                
        # Sort items by predicted score
        sorted_items = sorted(item_scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
        
        recommendations = []
        for prod_id, score in sorted_items:
            recommendations.append({
                "product_id": int(prod_id),
                "score": float(score),
                "reason": "Similar users interacted with this product"
            })
            
        return recommendations
