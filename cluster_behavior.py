# cluster_interpreter.py — HUMAN-READABLE
import pandas as pd
import json
from collections import Counter

df = pd.read_csv('data/ember2018/processed_train.csv')
with open('data/ember2018/feature_names.json') as f:
    feature_names = json.load(f)

# Map x_0 → real name
name_map = {f"x_{i}": name for i, name in enumerate(feature_names)}
df.rename(columns=name_map, inplace=True)

cluster_labels = pd.read_csv('results/cluster_labels.csv')['cluster']
df['cluster'] = cluster_labels

mapping = {}
for cid in sorted(df['cluster'].unique()):
    cluster_df = df[df['cluster'] == cid]
    means = cluster_df.drop(['label', 'cluster'], axis=1).mean()
    top_feats = means.nlargest(10).index.tolist()
    
    # Group analysis
    groups = Counter()
    for f in top_feats:
        if 'import' in f: groups['imports'] += 1
        elif 'section' in f: groups['sections'] += 1
        elif 'byte' in f or 'entropy' in f: groups['byte_stats'] += 1
        else: groups['other'] += 1
    
    dominant = groups.most_common(1)[0][0] if groups else "unknown"
    
    mapping[f"Cluster {cid}"] = {
        "top_features": top_feats,
        "dominant_group": dominant,
        "interpretation": f"High activity in {dominant.replace('_', ' ')}"
    }
    
    print(f"Cluster {cid} → {dominant}")
    print(f"   Top: {', '.join(top_feats[:3])}")

with open('results/cluster_interpretation.json', 'w') as f:
    json.dump(mapping, f, indent=2)