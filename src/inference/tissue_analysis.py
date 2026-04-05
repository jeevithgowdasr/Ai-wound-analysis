import cv2
import numpy as np

class TissueAnalysis:
    """
    Advanced Colorimetric Analysis for Clinical Signal Extraction.
    Extracts numerical bio-markers (Redness, Slough) from the wound bed.
    """

    @staticmethod
    def calculate_redness_index(image_rgb: np.ndarray, wound_mask: np.ndarray) -> float:
        """
        Quantifies 'Erythema' (Redness) intensity relative to the image context.
        High redness often correlates with Inflammation or Granulation (healthy).
        Extremely high/dark redness can indicate Infection.
        
        Method:
        Convert to LAB color space. 'A' channel represents Green-Red axis.
        We calculate the mean 'A' value strictly within the wound mask.
        """
        if np.sum(wound_mask) == 0:
            return 0.0

        # Convert to LAB (Lightness, A=Green-Red, B=Blue-Yellow)
        lab = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        # apply mask
        wound_a_vals = a[wound_mask > 0]
        
        # Normalize (0-255 -> 0.0-1.0)
        # Note: In OpenCV LAB, 'a' range is 0-255, where ~128 is neutral gray. >128 is red.
        mean_redness = np.mean(wound_a_vals)
        normalized_score = max(0, (mean_redness - 128)) / 127.0
        
        return round(normalized_score, 3)

    @staticmethod
    def detect_exudate_slough(image_rgb: np.ndarray, wound_mask: np.ndarray) -> dict:
        """
        Quantifies Yellow/White tissue (Slough/Pus/Exudate).
        Presence of >50% slough strongly correlates with delayed healing and infection risk.
        
        Method:
        HSV Thresholding within the wound boundary.
        Slough is typically High Value (Brightness) and Low-Mid Saturation, Yellow hue.
        """
        if np.sum(wound_mask) == 0:
            return {"percent_slough": 0.0, "risk_level": "None"}
            
        hsv = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2HSV)
        
        # Define Yellow/White Slough Range
        # Hue: 15-35 (Yellows)
        # Saturation: 20-150 (Pale to Moderate, not vibrant)
        # Value: 150-255 (Bright)
        lower_slough = np.array([15, 20, 150])
        upper_slough = np.array([35, 150, 255])
        
        slough_mask_raw = cv2.inRange(hsv, lower_slough, upper_slough)
        
        # Strict Intersection: Must be Slough AND Inside the Wound
        # (Ignore yellow background objects)
        final_slough = cv2.bitwise_and(slough_mask_raw, slough_mask_raw, mask=wound_mask.astype(np.uint8))
        
        slough_pixels = np.count_nonzero(final_slough)
        total_wound_pixels = np.count_nonzero(wound_mask)
        
        pct_slough = (slough_pixels / total_wound_pixels) * 100
        
        risk = "Low"
        if pct_slough > 25: risk = "Moderate"
        if pct_slough > 50: risk = "High (Debridement likely needed)"
        
        return {
            "percent_slough": round(pct_slough, 1),
            "risk_level": risk
        }
