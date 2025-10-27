from datasets import load_dataset
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import os

def process_ember2018(save_path='data/ember2018', max_samples=10000):
    os.makedirs(save_path, exist_ok=True)
    
    # Load dataset with streaming
    dataset = load_dataset("cw1521/ember2018-malware", split="train", streaming=True)
    
    # Collect first max_samples
    samples = []
    for sample in dataset:
        # Debug: Print sample keys and types to verify structure
        print("Sample keys and types:", {k: type(v) for k, v in sample.items()})
        # Map labels: -1/0 -> 0 (benign), 1 -> 1 (malicious)
        label = 0 if sample['y'] <= 0 else 1
        # Extract features from 'x' key, assuming it's a list of numerical values
        if 'x' in sample and isinstance(sample['x'], (list, np.ndarray)):
            features = {'x_' + str(i): val for i, val in enumerate(sample['x'])}
            if not features:
                continue  # Skip if 'x' is empty or invalid
            samples.append({
                'label': label,
                'features': features
            })
        else:
            print(f"Skipping sample due to missing or invalid 'x' key: {sample.keys()}")
            continue
        if len(samples) >= max_samples:
            break
    
    if not samples:
        raise ValueError("No samples collected from dataset. Check dataset loading.")
    if len(samples) < max_samples:
        print(f"Warning: Only {len(samples)} samples available.")
    
    # Flatten to DataFrame
    df = pd.DataFrame([s['features'] for s in samples])
    df['label'] = [s['label'] for s in samples]
    
    # Verify DataFrame is not empty
    if df.empty:
        raise ValueError("DataFrame is empty after loading samples. Check feature extraction.")
    
    # Select key features (all columns except 'label' are features)
    feature_cols = [col for col in df.columns if col != 'label']
    df = df[feature_cols + ['label']]
    
    # Handle missing values and identify numeric columns
    numeric_cols = df.select_dtypes(include=np.number).columns.drop('label', errors='ignore')
    if numeric_cols.empty:
        raise ValueError("No numeric columns found in DataFrame. Check feature extraction.")
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    
    # Normalize
    scaler = MinMaxScaler()
    if df[numeric_cols].empty or df[numeric_cols].isna().all().any():
        raise ValueError("No valid numerical data to scale. Check for NaN or empty columns.")
    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])
    
    # Save
    df.to_csv(os.path.join(save_path, 'processed_train.csv'), index=False)
    np.save(os.path.join(save_path, 'scaler.npy'), scaler)
    
    print(f"Processed {len(df)} PE samples. Shape: {df.shape}")
    print(df.head())
    return df, scaler

if __name__ == "__main__":
    process_ember2018()