from fastapi import FastAPI
from pydantic import BaseModel
from model import recommend

app = FastAPI()

class RequestData(BaseModel):
    averageBudget: float
    topPreferences: list[str]

@app.post("/recommend")
def get_recommendations(data: RequestData):
    results = recommend(
        group_preferences=data.topPreferences,
        group_budget=data.averageBudget
    )

    return {
        "averageBudget": data.averageBudget,
        "topPreferences": data.topPreferences,
        "recommendations": results
    }