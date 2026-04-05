# Smart Capture UX Design
**Target:** Rural users, Low Digital Literacy.
**Goal:** Consistent daily wound photos without training.

## Core Philosophy: "One Big Button"
The interface must require zero navigation. The app opens directly to the camera flow.

## The 3-Step Flow

### Step 1: Alignment (The "Ghost" Feature)
*   **Problem:** Users take photos from different distances every day, making area comparison impossible.
*   **Solution:** When taking a photo for "Day 5", display the photo from "Day 4" as a **50% transparent overlay** on the camera viewfinder.
*   **Instruction:** "Match the drawing." (Simple language).
*   **Visual:** Large outline of the previous wound.

### Step 2: Scale Validation (The "Green Sticker")
*   **Problem:** Forgotten reference marker.
*   **Solution:** Computer Vision check *before* allowing the shutter press.
*   **UI Behavior:** 
    *   Shutter button is **Gray/Disabled**.
    *   Text: "Show Green Sticker".
    *   Once sticker detected -> Shutter turns **Green/Enabled**.

### Step 3: Instant Feedback
*   **Problem:** Blurry photos uploaded, measuring fails 10 mins later.
*   **Solution:** Local JS-based sharpness check immediately after capture.
*   **Result:**
    *   *Green Checkmark:* "Good!" -> Auto-upload.
    *   *Red X:* "Too shaky. Try again." -> Retake immediately.

## Accessibility Choices
1.  **High Contrast:** Black background, Bright Green buttons. Outdoor visibility.
2.  **Iconography:** Use universal icons (Camera, Checkmark, X) instead of heavy text.
3.  **Audio Chimes:** Positive 'Ding' on valid sticker detection to guide users without them looking at the screen text.
4.  **No Login:** (If possible for PoC) Use "Device ID" or a simple numeric PIN to avoid typing emails/passwords on small screens.
