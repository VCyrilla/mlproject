# data_processor.py — FINAL: REAL EMBER FEATURE NAMES
from datasets import load_dataset
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import os
import json

DATA_PATH = 'data/ember2018'
os.makedirs(DATA_PATH, exist_ok=True)

print("Loading EMBER 2018 dataset from Hugging Face...")

dataset = load_dataset("cw1521/ember2018-malware", split="train", streaming=True)

# === EMBER FEATURE GROUPS (2381 total) ===
FEATURE_GROUPS = [
    ("byte_hist", 256),
    ("entropy_hist", 256),
    ("string", 100),
    ("general", 8),
    ("header", 64),
    ("section", 5 * 68),  # 5 props × 68 sections
    ("import", 1280),
    ("export", 128),
    ("datadirectory", 16),
    ("certificate", 9),
    ("resource", 200),
]

def generate_feature_names():
    names = []
    idx = 0
    for group, count in FEATURE_GROUPS:
        if group == "section":
            for sec in range(68):
                for prop in ["size", "virtual_size", "entropy", "raw_size", "char"]:
                    names.append(f"section_{sec}_{prop}")
                    idx += 1
        else:
            for i in range(count):
                names.append(f"{group}_{i}")
                idx += 1
    return names[:2381]

feature_names = generate_feature_names()
print(f"Generated {len(feature_names)} feature names. Sample: {feature_names[:5]}")

# === PROCESS DATA ===
samples = []
for i, sample in enumerate(dataset):
    if i >= 10000:
        break
    if 'x' in sample and len(sample['x']) == 2381:
        label = 0 if sample['y'] <= 0 else 1
        features = {feature_names[j]: float(sample['x'][j]) for j in range(2381)}
        samples.append({'label': label, **features})
    if (i + 1) % 1000 == 0:
        print(f"Processed {i + 1} samples...")

df = pd.DataFrame(samples)
scaler = MinMaxScaler()
numeric_cols = df.columns.drop('label')
df[numeric_cols] = scaler.fit_transform(df[numeric_cols])

df.to_csv(os.path.join(DATA_PATH, 'processed_train.csv'), index=False)
np.save(os.path.join(DATA_PATH, 'scaler.npy'), scaler)

with open(os.path.join(DATA_PATH, 'feature_names.json'), 'w') as f:
    json.dump(feature_names, f, indent=2)

print(f"SUCCESS: {len(df)} samples saved with {len(feature_names)} real features")