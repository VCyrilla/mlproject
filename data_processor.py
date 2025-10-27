from datasets import load_dataset
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import os

def process_ember2024(save_path='data/ember2024', max_samples=10000):
    os.makedirs(save_path, exist_ok=True)
    
    # Load train split with streaming (no full download)
    dataset = load_dataset("FutureComputing4AI/EMBER2024", split="train", streaming=True)  # Adjust dataset name if needed
    
    # Filter to PE and collect first max_samples
    pe_samples = []
    for sample in dataset:
        if sample.get('file_type', '').startswith('PE'):  # Handles Win32/Win64 PE
            pe_samples.append(sample)
        if len(pe_samples) >= max_samples:
            break
    
    if len(pe_samples) < max_samples:
        print(f"Warning: Only {len(pe_samples)} PE samples available.")
    
    # Convert to DataFrame (features assumed in 'features' column as dict/array)
    df = pd.DataFrame(pe_samples)
    if 'features' in df.columns:  # Flatten if needed
        df_features = pd.json_normalize(df['features'])  # Or np.array(df['features'].tolist())
        df = pd.concat([df.drop('features', axis=1), df_features], axis=1)
    
    # Select key columns (adjust based on actual: entropy, histograms, etc.)
    feature_cols = [col for col in df.columns if col.startswith(('byteentropy', 'histogram', 'imports')) or col == 'SizeOfCode']
    df = df[feature_cols + ['label']]  # Add label
    
    # Handle missing
    numeric_cols = df.select_dtypes(include=np.number).columns.drop('label', errors='ignore')
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    
    # Normalize
    scaler = MinMaxScaler()
    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])
    
    # Save
    df.to_csv(os.path.join(save_path, 'processed_train.csv'), index=False)
    np.save(os.path.join(save_path, 'scaler.npy'), scaler)
    
    print(f"Processed {len(df)} PE samples. Shape: {df.shape}")
    return df, scaler

if __name__ == "__main__":
    process_ember2024()