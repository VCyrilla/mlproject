# cluster_final.py
import json, glob, pandas as pd
import numpy as np
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

print("TRACEBOX LITE: FINAL CLUSTERING\n")

traces = [json.load(open(f)) for f in glob.glob("traces/*.json")]
seqs = [" ".join(t["api_sequence"]) for t in traces]

print(f"Loaded {len(traces)} traces")

# TF-IDF
vec = TfidfVectorizer(max_features=100, ngram_range=(1,2))
X = vec.fit_transform(seqs)

# Normalize
X = StandardScaler(with_mean=False).fit_transform(X)

# K-Means (2 clusters: benign vs malicious)
kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
labels = kmeans.fit_predict(X)

# Results
df = pd.DataFrame({
    "sample": [t["sample"][:20] for t in traces],
    "events": [len(t["api_sequence"]) for t in traces],
    "top_api": [Counter(t["api_sequence"]).most_common(1)[0][0] for t in traces],
    "cluster": labels
}).sort_values("cluster")

print(df.to_string(index=False))
df.to_csv("clusters_final.csv", index=False)

print(f"\nClusters found: {df['cluster'].nunique()}")
print(f"Benign: {len(df[df['sample'].str.contains('test', case=False)])}")
print(f"Malicious: {len(df) - len(df[df['sample'].str.contains('test', case=False)])}")