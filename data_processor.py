# data_processor.py — FINAL: EMBER 2018 (2381 features)
from datasets import load_dataset
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import os
import json

DATA_PATH = 'data/ember2018'
os.makedirs(DATA_PATH, exist_ok=True)

print("Loading EMBER 2018 dataset from Hugging Face...")

# Load dataset
dataset = load_dataset("cw1521/ember2018-malware", split="train", streaming=True)

samples = []
for i, sample in enumerate(dataset):
    if i >= 10000:
        break
    if 'x' in sample and len(sample['x']) == 2381:
        label = 0 if sample['y'] <= 0 else 1
        samples.append({'label': label, 'features': {f"f_{j}": float(sample['x'][j]) for j in range(2381)}})
    if (i+1) % 1000 == 0:
        print(f"Processed {i+1} samples...")

if not samples:
    raise ValueError("No valid samples!")

df = pd.DataFrame([s['features'] for s in samples])
df['label'] = [s['label'] for s in samples]

# Scale
scaler = MinMaxScaler()
numeric_cols = df.columns.drop('label')
df[numeric_cols] = scaler.fit_transform(df[numeric_cols])

# Save
df.to_csv(os.path.join(DATA_PATH, 'processed_train.csv'), index=False)
np.save(os.path.join(DATA_PATH, 'scaler.npy'), scaler)

# Save feature names (generic but meaningful)
feature_names = [f"feature_{i}" for i in range(2381)]
with open(os.path.join(DATA_PATH, 'feature_names.json'), 'w') as f:
    json.dump(feature_names, f, indent=2)

print(f"SUCCESS: {len(df)} samples, 2381 features")