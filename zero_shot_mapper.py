# --------------------------------------------------------------
# zero_shot_mapper.py  (FINAL – cache-proof, tiny fallback)
# --------------------------------------------------------------

# ---- 1. SET CACHE *BEFORE* ANY IMPORT -----------------------
import os
import sys
import json
import pandas as pd
import numpy as np

PROJECT_ROOT = r'D:\Academics\Year 4\Semester II\ICSProject II\mlproject'
CACHE_DIR    = os.path.join(PROJECT_ROOT, 'huggingface_cache')
os.makedirs(CACHE_DIR, exist_ok=True)

# ---- FORCE EVERY HF component to use our folder ----------------
os.environ['HF_HOME']               = CACHE_DIR
os.environ['TRANSFORMERS_CACHE']    = CACHE_DIR
os.environ['HUGGINGFACE_HUB_CACHE'] = CACHE_DIR
os.environ['HF_DATASETS_CACHE']     = CACHE_DIR
os.environ['HF_METRICS_CACHE']      = CACHE_DIR

# ---- OPTIONAL: disable the default user cache completely ----
os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'

print(f"\nCache directory (forced): {CACHE_DIR}")
print(f"Free space in cache folder: {round(__import__('shutil').disk_usage(CACHE_DIR).free / 1e9, 2)} GB\n")

# ---- NOW import transformers ---------------------------------
from transformers import pipeline
import torch

# --------------------------------------------------------------
# 2. EMBER feature metadata
# --------------------------------------------------------------
EMBER_FEATURE_MAP = {
    "f_637": "imports: kernel32.dll!VirtualAlloc",
    "f_665": "section: .rsrc entropy",
    "f_624": "imports: advapi32.dll!CryptAcquireContext",
    "f_654": "section: .data size",
    "f_642": "imports: user32.dll!MessageBox",
    "f_973": "general: file size",
    "f_1174": "string: 'This program cannot be run in DOS mode'",
    "f_618": "imports: kernel32.dll!CreateFile",
}
def friendly_name(f): return EMBER_FEATURE_MAP.get(f, f"unknown PE feature '{f}'")

# --------------------------------------------------------------
# 3. OWASP categories
# --------------------------------------------------------------
OWASP_CATEGORIES = [
    "cryptographic failures","injection vulnerabilities","broken access control",
    "insecure design","security misconfiguration","vulnerable components",
    "identification failures","software integrity failures",
    "security logging failures","server-side request forgery"
]

# --------------------------------------------------------------
# 4. Load classifier – tiny fallback if large model fails
# --------------------------------------------------------------
def _free_space_gb(path):
    return __import__('shutil').disk_usage(path).free / 1e9

def load_classifier():
    models = [
        ("facebook/bart-large-mnli",            1.63),   # ~1.63 GB
        ("typeform/distilbert-base-uncased-mnli", 0.26), # ~260 MB
    ]
    device = 0 if torch.cuda.is_available() else -1
    print(f"CUDA available: {torch.cuda.is_available()} → device = {device}")

    for name, size_gb in models:
        needed = size_gb * 1.1   # 10% safety margin
        if _free_space_gb(CACHE_DIR) < needed:
            print(f"Not enough space for {name} ({size_gb:.2f} GB needed, "
                  f"{_free_space_gb(CACHE_DIR):.2f} GB free) → skipping")
            continue

        print(f"\nTrying {name} ({size_gb:.2f} GB)…")
        try:
            pipe = pipeline(
                "zero-shot-classification",
                model=name,
                device=device,
                cache_dir=CACHE_DIR,
                torch_dtype=torch.float32 if device == -1 else torch.float16
            )
            print(f"{name} loaded!")
            return pipe
        except Exception as e:
            print(f"{name} failed → {e}")

    raise RuntimeError("No zero-shot model could be loaded (disk space or network issue).")

classifier = load_classifier()

# --------------------------------------------------------------
# 5. Build natural-language description
# --------------------------------------------------------------
def build_description(feat, series):
    s = {
        "mean": series.mean(),
        "std":  series.std(),
        "uniq": len(series.unique()),
        "min":  series.min(),
        "max":  series.max(),
    }
    base = (f"The feature '{feat}' ({friendly_name(feat)}) has "
            f"mean={s['mean']:.3f}, std={s['std']:.3f}, {s['uniq']} unique values.")
    low = feat.lower()
    if any(k in low for k in ["entropy","byteentropy"]):
        return f"{base} It measures randomness – high in packed/encrypted malware."
    if "import" in low:
        return f"{base} It counts DLL API imports (potential malicious capabilities)."
    if "size" in low:
        return f"{base} It records section/file size – outliers may indicate obfuscation."
    if "histogram" in low:
        return f"{base} It shows byte distribution – skewed = packing."
    if "string" in low:
        return f"{base} It contains embedded strings (C2 URLs, payloads)."
    return f"{base} It is a static PE property used for malware analysis."

# --------------------------------------------------------------
# 6. Main mapping
# --------------------------------------------------------------
def map_ember_to_owasp():
    csv_path = os.path.join(PROJECT_ROOT, r'data\ember2018\train_selected.csv')
    if not os.path.exists(csv_path):
        print(f"EMBER CSV not found: {csv_path}")
        return None

    df = pd.read_csv(csv_path)
    print(f"\nLoaded {df.shape[0]:,} rows, {df.shape[1]-1} features")
    feats = [c for c in df.columns if c != 'label']
    sample = feats[:50]                     # change to len(feats) for full run
    print(f"Analyzing {len(sample)} features")

    mappings = {}
    hypothesis = "This feature indicates {}."

    for i, f in enumerate(sample, 1):
        print(f"\n[{i}/{len(sample)}] {f}")
        col = df[f].dropna()
        if col.empty:
            print("  → empty – skip")
            continue

        desc = build_description(f, col)
        print(f"  Desc: {desc[:120]}...")

        try:
            out = classifier(
                sequences=desc,
                candidate_labels=OWASP_CATEGORIES,
                hypothesis_template=hypothesis,
                multi_label=True
            )
            top = [(lbl, round(sc, 3)) for lbl, sc in zip(out['labels'], out['scores']) if sc > 0.2][:3]
            mappings[f] = {
                "description": desc,
                "metadata": friendly_name(f),
                "top_owasp": top,
                "all_scores": dict(zip(out['labels'], out['scores']))
            }
            print(f"  Top OWASP → {top}")
        except Exception as e:
            print(f"  Error: {e}")

    # ---- save ----
    os.makedirs('results', exist_ok=True)
    out_file = 'results/ember_owasp_mappings.json'
    with open(out_file, 'w', encoding='utf-8') as fp:
        json.dump(mappings, fp, indent=2, ensure_ascii=False)
    print(f"\nMappings saved → {out_file}")
    create_summary(mappings)
    return mappings

# --------------------------------------------------------------
# 7. Summary
# --------------------------------------------------------------
def create_summary(m):
    counts = {c: 0 for c in OWASP_CATEGORIES}
    for d in m.values():
        for cat, sc in d.get("top_owasp", []):
            if sc > 0.25: counts[cat] += 1
    total = len(m)
    print("\n" + "="*68)
    print("OWASP CATEGORY COVERAGE SUMMARY")
    print("="*68)
    for cat in OWASP_CATEGORIES:
        pct = counts[cat]/total*100 if total else 0
        print(f"{cat:35} : {counts[cat]:2d} feats ({pct:5.1f}%)")
    with open('results/owasp_summary.json', 'w', encoding='utf-8') as fp:
        json.dump({"features": total, "coverage": counts}, fp, indent=2)

# --------------------------------------------------------------
# 8. Malware vs Benign diff
# --------------------------------------------------------------
def malware_vs_benign():
    try:
        df = pd.read_csv(os.path.join(PROJECT_ROOT, r'data\ember2018\train_selected.csv'))
        mal = df[df['label']==1].drop('label', axis=1)
        ben = df[df['label']==0].drop('label', axis=1)
        print(f"\nMalware rows: {len(mal):,}")
        print(f"Benign rows : {len(ben):,}")

        diffs = [(c, abs(mal[c].mean() - ben[c].mean())) for c in mal.columns]
        top10 = sorted(diffs, key=lambda x: x[1], reverse=True)[:10]
        print("\nTop 10 differentiating features:")
        for f,d in top10:
            print(f"  {f:10} → {friendly_name(f):50} | Δ = {d:.4f}")
    except Exception as e:
        print(f"Diff error: {e}")

# --------------------------------------------------------------
# 9. Entry point
# --------------------------------------------------------------
if __name__ == "__main__":
    print("\nEMBER → OWASP Zero-Shot Mapper (cache-proof)\n")
    mappings = map_ember_to_owasp()
    if mappings:
        malware_vs_benign()
        print("\nFinished – see 'results/' folder.")
    else:
        print("\nMapping failed.")