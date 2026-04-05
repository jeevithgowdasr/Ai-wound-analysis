# Recommended Wound Image Datasets

## 1. FUSeg (Foot Ulcer Segmentation Challenge)
*   **Best for:** Segmentation (Wound Boundary)
*   **Size:** ~1,210 images (Training/Test splits)
*   **Label Type:** High-quality pixel-wise segmentation masks (Ground Truth by experts).
*   **License:** Creative Commons Attribution-NonCommercial (CC BY-NC, check specific challenge terms).
*   **Source:** [azh-wound-care-center/FUSeg](https://github.com/uwm-bigdata/wound-segmentation)
*   **Why for POC:** It is the largest, most standardized public dataset specifically for segmentation, making it the "Gold Standard" for a 6-week project.

## 2. Medetec Wound Database (Select Images)
*   **Best for:** Clinical variety & Test set creation.
*   **Size:** Varies (Several hundred accessible via web scraps/research repos).
*   **Label Type:** Mostly raw images; some third-party repos have masks.
*   **License:** Commercial/Stock photo origin. (Use strictly for "Fair Use" in research/POC only, do NOT redeploy in prod without purchase).
*   **Why for POC:** High-resolution, diverse wound types (venous, arterial, pressure) to test model robustness on non-foot ulcers.

## 3. DFUC 2020 (Diabetic Foot Ulcer Challenge)
*   **Best for:** Detection (Bounding Boxes) -> Can be used to crop images before segmentation.
*   **Size:** ~2,000+ images.
*   **Label Type:** Bounding Boxes.
*   **License:** Research Use Only.
*   **Why for POC:** Good for training a "Wound Detector" (Object Detection) if the segmentation model struggles with background noise.

## 4. Kaggle "Wound Dataset" (Various)
*   **Best for:** Healing status (Infection vs Healing) Classification.
*   **Size:** ~700-1000 images (often aggregated).
*   **Label Type:** Folder-based classification labels (e.g., `Infected`, `Normal`).
*   **License:** ODbL or Unknown (Risky for commercial, fine for personal POC).
*   **Why for POC:** Good secondary dataset if you want to attempt the "Classification" bonus goal.

# Recommendation for POC
**Use FUSeg:**
1.  **Strictly aligned** with your goal (Segmentation).
2.  **Ready-to-use** masks (Binary images) mean zero labeling effort.
3.  **Size** is perfect for Transfer Learning (enough to learn, small enough to train in <2 hours on Colab).
