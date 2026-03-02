import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "destinations.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

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

# Scale features
scaler = StandardScaler()
scaled_features = scaler.fit_transform(df[FEATURE_COLUMNS])

# Train clustering model
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(scaled_features)

# Save models
joblib.dump(kmeans, os.path.join(MODEL_DIR, "kmeans.pkl"))
joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))

print("✅ Model training complete. Files saved in models/")