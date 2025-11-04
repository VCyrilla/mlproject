# heatmap.py
import json, glob, pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from collections import Counter

print("Generating heatmap...")

# Load traces
traces = [json.load(open(f)) for f in glob.glob("traces/*.json")]

# Build API frequency table (as integers)
df = pd.DataFrame([Counter(t["api_sequence"]) for t in traces]).fillna(0).astype(int)
df.index = [t["sample"][:15] for t in traces]  # Shorten sample names

# Plot
plt.figure(figsize=(9, 6))
sns.heatmap(
    df.T,
    annot=True,
    cmap="Blues",
    fmt="d",           # Now safe: df is int
    cbar_kws={'label': 'API Call Count'},
    linewidths=.5
)
plt.title("TraceBox Lite: API Call Frequency Heatmap", fontsize=14, pad=20)
plt.xlabel("Sample", fontsize=12)
plt.ylabel("API Call", fontsize=12)
plt.tight_layout()

# Save & show
plt.savefig("heatmap.png", dpi=300, bbox_inches="tight")
print("[+] Heatmap saved: heatmap.png")
plt.show()