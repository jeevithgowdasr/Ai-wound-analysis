# WoundSense AI - Proof of Concept Demo Scenario

**Demo Narrative: "Saving Sarah's Sunday"**
*User Persona:* Sarah, a 45-year-old daughter caring for her father (John, 72, Diabetic) at home.
*Goal:* Monitor a diabetic foot ulcer to prevent hospitalization.

---

## Phase 1: The Baseline (Day 1)
**Scene:** It's the first day of using the app. Sarah is nervous about doing it right.

1.  **Smart Capture:**
    *   Sarah opens the app. No login (auto-detects ID).
    *   Big button: **"Scan Wound"**.
    *   **Guidance:** Text says *"Please place the Green Sticker next to the wound."*
    *   **Action:** She points the phone. The shutter button remains **Gray (Disabled)** until the AI detects the sticker.
    *   **Success:** A cheerful "Ding!" sound plays. The button turns **Green**. She snaps the photo.

2.  **Instant AI Analysis:**
    *   **Loading Screen:** *"Measuring..."* (2 seconds).
    *   **Result:** A clean card appears.
        *   **Image:** Her photo with a **Blue Outline** automatically drawn around the wound.
        *   **Metric:** "Area: 4.5 cm²".
        *   **Status:** "Baseline Recorded. We'll track changes from here!"

---

## Phase 2: The Routine (Day 7)
**Scene:** Sarah captures the weekly photo.

1.  **The "Ghost" Overlay:**
    *   When she opens the camera, a faint semi-transparent outline of Day 1's photo appears.
    *   **Instruction:** *"Line up with the drawing."*
    *   She aligns the foot perfectly. Snap.

2.  **The Healing Trend:**
    *   **Dashboard:** A Line Graph appears showing 2 points.
    *   **Visual:** The line is sloping *downwards* (Green).
    *   **Message:** *"Great news! The wound has shrunk by 10% this week."*
    *   **Clinical Note (Hidden):** `Velocity: -0.4 cm²/week`.

---

## Phase 3: The Early Alert (Day 14)
**Scene:** John bumped his foot yesterday. It looks a bit red, but Sarah isn't sure if it's bad enough to call the doctor on a weekend.

1.  **The Scan:** She takes the photo as usual.
2.  **The AI Catch:**
    *   The processing takes a split second longer.
    *   **Result:** The Dashboard header turns **ORANGE**.
    *   **Alert:** *"Healing Stalled. Increased Redness Detected."*

3.  **Explainability (Why?):**
    *   Sarah taps **"Analyze"**.
    *   **Heatmap View:** The app overlays a **Red Heatmap** on the upper edge of the wound.
    *   **Tissue Analysis:**
        *   *Previous:* 10% Slough.
        *   *Today:* **35% Slough / High Redness Index**.
    *   **Advice:** *"We noticed swelling and redness. Please clean the area carefully and consult your nurse if it feels hot."*

---

## Phase 4: Resolution (Day 21)
**Scene:** After Sarah cleaned it extra carefully based on the alert, the wound recovered.

1.  **The Report:**
    *   The graph shows a small "bump" (the Day 14 flare-up) but the line is now trending down again.
    *   **Status:** **Green "Healing on Track"**.
    *   **Metric:** "Area: 3.2 cm² (Total reduction: 28%)".

---

## Demo Wrap-Up
**Value Prop:**
1.  **Peace of Mind:** Sarah didn't panic on Day 14; she got actionable data.
2.  **Professional Data:** The doctor sees the specific "Day 14 Spike" in the web dashboard, validating Sarah's care.
