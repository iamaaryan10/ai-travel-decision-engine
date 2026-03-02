import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "destinations.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

df = pd.read_csv(DATA_PATH)

FEATURE_COLUMNS = [
    "mountains",
    "beach",
    "nightlife",
    "adventure",
    "luxury",
    "culture",
    "budget"
]

# Load trained models
kmeans = joblib.load(os.path.join(MODEL_DIR, "kmeans.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))

# Assign clusters to dataset
scaled_features = scaler.transform(df[FEATURE_COLUMNS])
df["cluster"] = kmeans.predict(scaled_features)


def recommend(group_preferences, group_budget):

    user_vector = np.array([
        1 if feature in group_preferences else 0
        for feature in FEATURE_COLUMNS
    ])

    scaled_user = scaler.transform([user_vector])
    user_cluster = kmeans.predict(scaled_user)[0]

    results = []

    for _, row in df.iterrows():

        dest_vector = row[FEATURE_COLUMNS].values

        similarity = cosine_similarity(
            [user_vector],
            [dest_vector]
        )[0][0]

        budget_factor = 1 - abs(row["averageCost"] - group_budget) / group_budget
        cluster_bonus = 0.2 if row["cluster"] == user_cluster else 0

        final_score = (
            (similarity * 0.6) +
            (budget_factor * 0.2) +
            cluster_bonus
        )

        tags = [
            feature for feature in FEATURE_COLUMNS
            if row[feature] == 1
        ]

        results.append({
            "name": row["name"],
            "tags": tags,
            "averageCost": int(row["averageCost"]),
            "score": round(float(final_score * 10), 2),
            "cluster": int(row["cluster"])
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    return results