# cluster_interpreter.py — INTERPRET VIA TOP FEATURES
import pandas as pd
import json
import os
import numpy as np

DATA_PATH = 'data/ember2018'
RESULTS_PATH = 'results'
os.makedirs(RESULTS_PATH, exist_ok=True)

df = pd.read_csv(os.path.join(DATA_PATH, 'processed_train.csv'))
with open(os.path.join(DATA_PATH, 'feature_names.json')) as f:
    feature_names = json.load(f)

cluster_labels = pd.read_csv(os.path.join(RESULTS_PATH, 'cluster_labels.csv'))['cluster']
df['cluster'] = cluster_labels

mapping = {}
for cluster_id in sorted(df['cluster'].unique()):
    cluster_df = df[df['cluster'] == cluster_id]
    feature_means = cluster_df.drop(['label', 'cluster'], axis=1).mean()
    top_features = feature_means.nlargest(10).index.tolist()
    mapping[f"Cluster {cluster_id}"] = {
        "top_features": top_features,
        "interpretation": "High activity in engineered features (e.g., byte entropy, imports, section entropy)"
    }
    print(f"Cluster {cluster_id}: {top_features[:5]}")

with open(os.path.join(RESULTS_PATH, 'cluster_interpretation.json'), 'w') as f:
    json.dump(mapping, f, indent=2)

print("\nCLUSTER INTERPRETATION COMPLETE (EMBER FEATURES):")
print("="*50)
for k, v in mapping.items():
    print(f"{k} → {v['interpretation']}")
    print(f"   Top features: {', '.join(v['top_features'][:5])}")
print("="*50)