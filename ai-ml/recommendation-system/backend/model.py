import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os

def train_and_save_model():
    print("Training mock recommendation model...")
    # Mock data: users and their ratings for 5 movies
    data = {
        'user_id': [1, 1, 1, 2, 2, 3, 3, 3],
        'movie_id': [101, 102, 103, 101, 104, 102, 103, 104],
        'rating': [5, 4, 3, 4, 5, 2, 4, 5]
    }
    df = pd.DataFrame(data)
    
    # Create user-item matrix
    user_movie_matrix = df.pivot_table(index='user_id', columns='movie_id', values='rating').fillna(0)
    
    # Calculate cosine similarity between movies
    item_similarity = cosine_similarity(user_movie_matrix.T)
    item_similarity_df = pd.DataFrame(item_similarity, index=user_movie_matrix.columns, columns=user_movie_matrix.columns)
    
    # Save model
    os.makedirs('model_data', exist_ok=True)
    with open('model_data/item_similarity.pkl', 'wb') as f:
        pickle.dump(item_similarity_df, f)
    
    print("Model saved to model_data/item_similarity.pkl")

if __name__ == "__main__":
    train_and_save_model()
