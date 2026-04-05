# Dataset Directory Structure

This structure is designed for a **Semantic Segmentation** pipeline using PyTorch.

## Directory Layout

```text
data/
├── raw/                            # Immutable original data
│   └── FUSeg/                      # Raw download from FUSeg/AZH
│       ├── images/
│       └── masks/
├── processed/                      # Ready for PyTorch DataLoader
│   ├── train/
│   │   ├── images/                 # .jpg or .png (RGB)
│   │   └── masks/                  # .png (1-channel, 0=bg, 1=wound)
│   ├── val/
│   │   ├── images/
│   │   └── masks/
│   └── test/
│       ├── images/
│       └── masks/
└── splits/
    ├── train.csv                   # Filenames for reproducibility
    ├── val.csv
    └── test.csv
```

## Naming Convention
*   **Images:** `case_001.jpg`
*   **Masks:** `case_001.png`
*   *Constraint:* Filenames MUST match exactly between `images/` and `masks/` folders for the `Dataset` class to align them automatically.

## Mask Format (Crucial for PyTorch)
*   **Format:** PNG (Lossless).
*   **Channels:** 1 (Grayscale) or Palette-indexed.
*   **Values:**
    *   `0`: Background (Skin/Environment)
    *   `1`: Wound (Foreground) (or `255` if visualized, but normalized to `1` for CrossEntropyLoss).

## Preprocessing Pipeline Logic
1.  **Ingest** from `raw/FUSeg/`.
2.  **Resize** to fixed efficient size (e.g., 512x512).
3.  **Split** into Train (80%) / Val (10%) / Test (10%).
4.  **Save** to `processed/` structure.
