# cluster_interpreter.py — FINAL: ACCURATE GROUPING
import pandas as pd
import json
from collections import Counter

df = pd.read_csv('data/ember2018/processed_train.csv')
cluster_labels = pd.read_csv('results/cluster_labels.csv')['cluster']
df['cluster'] = cluster_labels

mapping = {}
for cid in sorted(df['cluster'].unique()):
    cluster_df = df[df['cluster'] == cid]
    means = cluster_df.drop(['label', 'cluster'], axis=1).mean()
    top_feats = means.nlargest(10).index.tolist()
    
    # ACCURATE GROUP DETECTION
    groups = Counter()
    for f in top_feats:
        if f.startswith('import_'): groups['imports'] += 1
        elif f.startswith('section_'): groups['sections'] += 1
        elif f.startswith('byte_hist') or f.startswith('entropy_hist'): groups['byte_entropy'] += 1
        elif f.startswith('header_'): groups['header'] += 1
        elif f.startswith('string_'): groups['strings'] += 1
        elif f.startswith('export_'): groups['exports'] += 1
        elif f.startswith('datadirectory_'): groups['data_directories'] += 1
        else: groups['other'] += 1
    
    dominant = groups.most_common(1)[0][0] if groups else "unknown"
    
    # HUMAN-READABLE INTERPRETATION
    interp_map = {
        'imports': "High imported API count — likely C2, droppers, or network activity",
        'sections': "Section anomalies (size, entropy) — likely packers or obfuscation",
        'byte_entropy': "Byte-level entropy patterns — packed, encrypted, or compressed code",
        'header': "PE header anomalies — modified timestamps, sizes, or characteristics",
        'strings': "Embedded strings — URLs, registry keys, or debug paths",
        'exports': "DLL exports — likely backdoors or loaders",
        'data_directories': "Resource or overlay data — icons, payloads",
        'other': "Mixed or general file properties"
    }
    
    interpretation = interp_map.get(dominant, "Unknown behavior")
    
    mapping[f"Cluster {cid}"] = {
        "top_features": top_feats,
        "dominant_group": dominant,
        "interpretation": interpretation
    }
    
    print(f"Cluster {cid} → {dominant}")
    print(f"   Top: {', '.join(top_feats[:3])}")

with open('results/cluster_interpretation.json', 'w') as f:
    json.dump(mapping, f, indent=2)

print("\nCLUSTER INTERPRETATION COMPLETE:")
print("="*50)
for k, v in mapping.items():
    print(f"{k} → {v['interpretation']}")
    print(f"   Top: {', '.join(v['top_features'][:3])}")
print("="*50)