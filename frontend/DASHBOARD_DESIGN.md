# Clinical Dashboard Design
**Target:** Wound Care Specialists / Nurses.
**Goal:** Assess healing status in <30 seconds per patient.

## Layout Structure (Grid System)

### 1. The "Traffic Light" Header (Top/Alerts)
*   **Purpose:** Instant triage.
*   **Visual:**
    *   **RED Card:** "High Risk / Infection Likely" (if Prob > 0.5 or Deteriorating).
    *   **YELLOW Card:** "Stalled" (if Velocity < 0.1).
    *   **GREEN Card:** "Healing on Track".
*   **Content:** Patient Name, Age, Diabetes Status, Last Upload Date.

### 2. The Healing Trajectory (Left Main Panel)
*   **Visualization:** Line Chart (X=Date, Y=Area $cm^2$).
*   **Features:**
    *   **Trend Line:** Dotted line showing "Expected Healing" vs "Actual".
    *   **Annotations:** Vertical markers for "Antibiotics Started" (Clinical correlation).
    *   **Interactive:** Clicking a dot on the graph loads that specific day's image in the Right Panel.

### 3. Deep Dive Inspector (Right Main Panel)
*   **Content:** Large display of the selected wound image.
*   **AI Toggle Layer:**
    *   [Switch] **"Show Wound Boundary"**: Overlays the blue segmentation mask.
    *   [Switch] **"Show Infection Hotspots"**: Overlays the Red Grad-CAM heatmap.
    *   [Switch] **"Show Tissue Types"**: Color-codes the bed (Red=Granulation, Yellow=Slough).
*   **Metrics:** Sidebar showing exact measurements for *that specific day* (e.g., "Area: 4.2cm²", "Slough: 30%").

### 4. The Filmstrip (Bottom)
*   **Visual:** Horizontal scroll of thumbnails sorted chronologically (Oldest -> Newest).
*   **Purpose:** Quick visual scan of morphing shape/color over weeks.
*   **Highlight:** The currently selected date is highlighted.

## Interaction Design
1.  **Compare Mode:** "Select Two" feature to place Day 1 and Day 30 side-by-side. Essential for "Before/After" reports.
2.  **Report Gen:** "Export PDF" button generates the SOAP note text defined in the backend.

## Tech Implementation
*   **Charts:** `Recharts` (React) for responsive SVG graphing.
*   **Image Viewer:** `react-medium-image-zoom` for detailed inspection.
