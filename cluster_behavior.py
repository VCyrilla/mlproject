# --------------------------------------------------------------
# cluster_behavior.py (FIXED: JSON serializable)
# --------------------------------------------------------------

import os
import json
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
import umap
import matplotlib.pyplot as plt
import seaborn as sns

# ------------------- 1. CONFIG -------------------
PROJECT_ROOT = r'D:\Academics\Year 4\Semester II\ICSProject II\mlproject'
CSV_PATH = os.path.join(PROJECT_ROOT, 'data', 'ember2018', 'train_selected.csv')
RESULTS_DIR = os.path.join(PROJECT_ROOT, 'results')
os.makedirs(RESULTS_DIR, exist_ok=True)

print("Unsupervised Clustering: EMBER Features → Behavioral Groups")

# ------------------- 2. LOAD DATA -------------------
if not os.path.exists(CSV_PATH):
    print(f"EMBER data not found: {CSV_PATH}")
    exit(1)

df = pd.read_csv(CSV_PATH)
print(f"Loaded {df.shape[0]:,} samples, {df.shape[1]-1} features")

X = df.drop('label', axis=1)
y = df['label']

feature_cols = X.columns[:50]
X_sample = X[feature_cols]

# ------------------- 3. PREPROCESS -------------------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_sample)

reducer = umap.UMAP(n_components=2, random_state=42)
X_2d = reducer.fit_transform(X_scaled)

# ------------------- 4. CLUSTER -------------------
db = DBSCAN(eps=0.5, min_samples=10)
clusters = db.fit_predict(X_scaled)

n_clusters = len(set(clusters)) - (1 if -1 in clusters else 0)
n_noise = list(clusters).count(-1)

print(f"\nClusters found: {n_clusters}")
print(f"Noise points (potential new variants): {n_noise}")

# ------------------- 5. VISUALIZE -------------------
plt.figure(figsize=(10, 8))
colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
scatter = plt.scatter(
    X_2d[:, 0], X_2d[:, 1],
    c=[colors[c % len(colors)] if c != -1 else 'gray' for c in clusters],
    s=10, alpha=0.7, edgecolors='none'
)

noise = X_2d[clusters == -1]
if len(noise) > 0:
    plt.scatter(noise[:, 0], noise[:, 1], c='red', s=30, marker='x', label='Noise (New Variant?)')

plt.title('Unsupervised Clustering of EMBER Features (UMAP + DBSCAN)')
plt.xlabel('UMAP 1')
plt.ylabel('UMAP 2')
plt.legend()
plt.tight_layout()
plt.savefig(os.path.join(RESULTS_DIR, 'clusters.png'), dpi=300)
print(f"\nPlot saved → {RESULTS_DIR}/clusters.png")

# ------------------- 6. SAVE STATS (FIXED) -------------------
cluster_counts = pd.Series(clusters).value_counts()
stats = {
    "n_clusters": int(n_clusters),
    "n_noise": int(n_noise),
    "cluster_sizes": {int(k): int(v) for k, v in cluster_counts.items()},  # ← FIXED
    "features_used": list(feature_cols)
}

with open(os.path.join(RESULTS_DIR, 'cluster_summary.json'), 'w') as f:
    json.dump(stats, f, indent=2)

print("\nCluster summary saved → results/cluster_summary.json")
print("\nDone! Open clusters.png to see behavioral groups.")