from fastapi import FastAPI
import random
import pandas as pd
from typing import List
from pydantic import BaseModel

app = FastAPI()

class MatchPrediction(BaseModel):
    team_a: str
    team_b: str
    win_probability_a: float
    win_probability_b: float

@app.get("/")
def read_root():
    return {"message": "Sports Analytics Engine Running"}

@app.get("/live-stats")
def get_live_stats():
    # Return mock live stats
    return {
        "current_match": "Eagles vs Falcons",
        "score_a": random.randint(10, 30),
        "score_b": random.randint(10, 30),
        "possession_a": 55,
        "possession_b": 45
    }

@app.get("/predict", response_model=List[MatchPrediction])
def predict_matches():
    # Return mock predictions
    return [
        MatchPrediction(team_a="Eagles", team_b="Falcons", win_probability_a=0.65, win_probability_b=0.35),
        MatchPrediction(team_a="Tigers", team_b="Lions", win_probability_a=0.45, win_probability_b=0.55),
        MatchPrediction(team_a="Bears", team_b="Wolves", win_probability_a=0.80, win_probability_b=0.20),
    ]

@app.get("/historical-performance/{team}")
def historical_performance(team: str):
    # Mock historical score data over 5 seasons
    data = pd.DataFrame({
        "Season": [2019, 2020, 2021, 2022, 2023],
        "Wins": [random.randint(5,15) for _ in range(5)]
    })
    return data.to_dict(orient="records")
