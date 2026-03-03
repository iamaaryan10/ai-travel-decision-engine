import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import joblib
import os
import json

# ---------------------------
# Paths
# ---------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "destinations.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

# ---------------------------
# Load Dataset
# ---------------------------
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

# ---------------------------
# Feature Scaling
# ---------------------------
scaler = StandardScaler()
scaled_features = scaler.fit_transform(df[FEATURE_COLUMNS])

print("\n🔎 Searching for optimal K (2–6)...\n")

best_k = None
best_score = -1
best_model = None

# ---------------------------
# Hyperparameter Tuning
# ---------------------------
for k in range(2, 7):
    kmeans = KMeans(n_clusters=k, random_state=42)
    clusters = kmeans.fit_predict(scaled_features)

    score = silhouette_score(scaled_features, clusters)

    print(f"K = {k} → Silhouette Score: {score:.4f}")

    if score > best_score:
        best_score = score
        best_k = k
        best_model = kmeans

# ---------------------------
# Final Results
# ---------------------------
print("\n📊 Best Configuration")
print("--------------------------------")
print(f"Best K: {best_k}")
print(f"Best Silhouette Score: {best_score:.4f}")
print("--------------------------------")

# ---------------------------
# Save Model & Scaler
# ---------------------------
joblib.dump(best_model, os.path.join(MODEL_DIR, "kmeans.pkl"))
joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))

# ---------------------------
# Save Evaluation Metrics
# ---------------------------
metrics = {
    "best_k": best_k,
    "silhouette_score": float(best_score),
    "dataset_size": len(df),
    "feature_count": len(FEATURE_COLUMNS)
}

with open(os.path.join(MODEL_DIR, "metrics.json"), "w") as f:
    json.dump(metrics, f, indent=4)

print("📁 Metrics saved to models/metrics.json")
print("✅ Optimal model saved successfully.\n")