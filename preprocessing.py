import pandas as pd
import numpy as np
from sklearn.feature_selection import SelectKBest, chi2
from sklearn.model_selection import train_test_split
from sklearn.decomposition import PCA
from sklearn.preprocessing import MinMaxScaler
import os

def preprocess_data(input_path=r'C:\ICS4D\ICS Project II\mlproject\data\ember2018\processed_train.csv', output_path='data/ember2018', n_features=500, test_size=0.2):
    os.makedirs(output_path, exist_ok=True)
    
    # Step 1: Load the processed data
    df = pd.read_csv(input_path)
    print(f"Loaded DataFrame shape: {df.shape}")
    if df.empty:
        raise ValueError(f"Input file {input_path} is empty or not found. Check the path and data_processor.py output.")
    
    # Step 2: Cleaning
    print(f"Before duplicates removal: {df.shape}")
    df = df.drop_duplicates(subset=df.columns[df.columns != 'label'])
    print(f"After duplicates removal: {df.shape}")
    
    numeric_cols = df.select_dtypes(include=np.number).columns.drop('label', errors='ignore')
    print(f"Numeric columns count: {len(numeric_cols)}")
    z_scores = np.abs((df[numeric_cols] - df[numeric_cols].mean()) / df[numeric_cols].std())
    print(f"Before outlier removal: {df.shape}")
    
    # COMMENTED OUT: Outlier removal using Z-score threshold of 3
    # df = df[(z_scores < 3).all(axis=1)]
    
    print(f"After outlier removal: {df.shape}")  # This will now show same shape as before
    
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    
    # Step 3: Label Verification
    df['label'] = df['label'].apply(lambda x: 0 if x <= 0 else 1)
    print("Label distribution:\n", df['label'].value_counts(normalize=True))
    
    # Step 4: Feature Selection
    X = df.drop('label', axis=1)
    y = df['label']
    
    if X.empty or y.empty:
        raise ValueError("No features or labels available after cleaning. Check data integrity.")
    
    selector = SelectKBest(chi2, k=n_features)
    X_selected = selector.fit_transform(X, y)
    selected_cols = X.columns[selector.get_support()].tolist()
    
    df_selected = pd.DataFrame(X_selected, columns=selected_cols)
    df_selected['label'] = y.reset_index(drop=True)
    
    # Step 5: Train/Test Split
    train, test = train_test_split(df_selected, test_size=test_size, random_state=42, stratify=y)
    
    # Save
    train.to_csv(os.path.join(output_path, 'train_selected.csv'), index=False)
    test.to_csv(os.path.join(output_path, 'test_selected.csv'), index=False)
    
    print(f"Selected {n_features} features. Train shape: {train.shape}, Test shape: {test.shape}")
    print("Top selected features:", selected_cols[:10])
    return train, test

if __name__ == "__main__":
    preprocess_data()