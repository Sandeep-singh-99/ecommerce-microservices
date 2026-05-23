import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import pickle
import os

def build_content_model(products_df: pd.DataFrame, model_dir: str):
    """
    Builds and saves a TF-IDF vectorizer and the resulting similarity matrix for products.
    """
    if products_df.empty or 'content' not in products_df.columns:
        print("Not enough product data to build content model.")
        return

    # Using TF-IDF on the combined 'content' column
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(products_df['content'])
    
    # Compute cosine similarity matrix
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    
    # Save the vectorizer and similarity matrix
    os.makedirs(model_dir, exist_ok=True)
    with open(os.path.join(model_dir, 'vectorizer.pkl'), 'wb') as f:
        pickle.dump(tfidf, f)
        
    with open(os.path.join(model_dir, 'similarity_matrix.pkl'), 'wb') as f:
        pickle.dump(cosine_sim, f)
        
    # Also save the product mapping (index to product_id)
    product_mapping = products_df['product_id'].to_dict()
    with open(os.path.join(model_dir, 'product_mapping.pkl'), 'wb') as f:
        pickle.dump(product_mapping, f)
        
    print("Content-based model built successfully.")
