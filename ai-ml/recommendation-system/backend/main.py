from fastapi import FastAPI, HTTPException
import pickle
import os

app = FastAPI()

MODEL_PATH = "model_data/item_similarity.pkl"
model = None

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
    else:
        print("Model not found. Please run model.py to train.")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Recommendation API"}

@app.get("/recommend/{item_id}")
def get_recommendations(item_id: int):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not trained yet. Run model.py")
    
    if item_id not in model.index:
        raise HTTPException(status_code=404, detail="Item not found.")
    
    # Get similar items
    similar_items = model[item_id].sort_values(ascending=False)
    # Filter out the item itself and get top 3 recommendations
    recommendations = similar_items[similar_items.index != item_id].head(3)
    
    return {"item_id": item_id, "recommendations": recommendations.to_dict()}
