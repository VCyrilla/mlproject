# train_clustering.py
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import seaborn as sns
import os

DATA_PATH = 'data/ember2018'
RESULTS_PATH = 'results'
os.makedirs(RESULTS_PATH, exist_ok=True)

df = pd.read_csv(os.path.join(DATA_PATH, 'processed_train.csv'))
X = df.drop('label', axis=1).values

# Clustering
kmeans = KMeans(n_clusters=6, random_state=42, n_init=10)
clusters = kmeans.fit_predict(X)
df['cluster'] = clusters

# PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)
plt.figure(figsize=(10, 8))
sns.scatterplot(x=X_pca[:, 0], y=X_pca[:, 1], hue=clusters, palette='deep', s=60)
plt.title("EMBER Feature-Based Malware Clusters")
plt.savefig(os.path.join(RESULTS_PATH, 'clusters_pca.png'))
plt.close()

df[['cluster']].to_csv(os.path.join(RESULTS_PATH, 'cluster_labels.csv'), index=False)
print("Clustering complete.")