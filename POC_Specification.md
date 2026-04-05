# WoundSense AI - Strict PoC Specification
*Revised by Medical AI Review Board for 6-Week Delivery*

### 1. The Core Problem
Clinicians cannot accurately track if a wound is shrinking between visits using current manual methods (paper rulers).
**The strictly defined solution:** A digital tool that calculates **Surface Area ($cm^{2}$)** from a photo to plot a trend line.

### 2. Strict Scope Limits

#### A. Machine Learning Scope: **ONE Model Only**
*   **Included:** **Binary Semantic Segmentation Model.**
    *   *Input:* Image of wound.
    *   *Output:* Binary Mask (Standard White=Wound, Black=Background).
    *   *Architecture:* MobileNetV2 + U-Net (Pre-trained on ImageNet).
*   **Excluded (Cut for Time):**
    *   Multi-class tissue segmentation (Red/Yellow/Black). Requires expert labeling and significantly more data.
    *   ML-based Blur/Quality detection. (Replaced with simple OpenCV Laplacian variance heuristics).
    *   ML-based Reference Object Detection. (Replaced with rigid assumption: User uses a Green Sticker/Reference Card, detected via color thresholding).

#### B. Clinical Outputs: **ONE Metric Only**
*   **Included:** **Surface Area ($cm^2$).**
    *   Calculated by comparing pixel count of the Wound Mask vs. the Reference Marker Mask.
*   **Excluded:**
    *   Depth/Volume.
    *   Tissue composition percentages.
    *   Infection probability.

#### C. Timeline: **6 Weeks**
*   **Week 1: Data & Setup.** Setup Repo/Cloud. Acquire public dataset (e.g., Medetec/AZH).
*   **Week 2: Pipeline.** Build Pre-processing (Resize/Norm) and Heuristic Reference Marker detection (Color Thresh).
*   **Week 3: Model Training.** Train Binary U-Net. Focus on IoU (Intersection over Union) > 0.7.
*   **Week 4: Measurement Logic.** Convert Pixel Area to $cm^2$ using reference.
*   **Week 5: App Integration.** Simple PWA/Streamlit interface for upload & viz.
*   **Week 6: Validation.** Test on 20 held-out images. Generate Demo Report.

### 3. Justification for Sufficiency
1.  **Clinical Value of "Size":** The most dominant predictor of wound healing trajectory is **percentage area reduction** over 2-4 weeks. If it captures this, the PoC is clinically successful.
2.  **Subjectivity of Tissue Types:** Classifying "Slough" vs "Granulation" is highly subjective even among experts. Removing this removes the biggest source of noise/error for a PoC.
3.  **Feasibility:** Detecting "Wound" vs "Skin" is a far easier computer vision task than multi-class segmentation, allowing high accuracy with smaller datasets in <6 weeks.

### 4. Technical Constraints
*   **Reference Marker:** STRICT requirement. Users must place a **Standard Green Circular Sticker (2cm diameter)** near the wound.
*   **Platform:** Single-page Web App (Streamlit or React). No native mobile app overhead.
*   **Processing:** Asynchronous API. User uploads -> Waits -> Result. No real-time edge inference required for PoC.

### 5. Assumptions
*   Images contain exactly ONE wound.
*   Images contain exactly ONE green reference sticker.
*   Images are taken at roughly 90-degree angle (perpindicular).
