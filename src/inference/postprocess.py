import numpy as np
import cv2
from datetime import datetime
from typing import List, Dict, Tuple

class WoundMeasurement:
    """
    Clinically accurate area calculation and longitudinal tracking.
    """

    # Constants
    REFERENCE_MARKER_AREA_CM2 = 3.14  # Example: Area of a 2cm diameter sticker (pi * r^2)
    
    @staticmethod
    def calculate_area(wound_mask: np.ndarray, marker_mask: np.ndarray) -> float:
        """
        Calculates real-world area (cm²) using the ratio method.
        
        Formula:
        (Wound_Pixels / Marker_Pixels) * Known_Marker_Area_cm2
        
        Args:
        - wound_mask: Binary mask of the wound.
        - marker_mask: Binary mask of the reference sticker.
        
        Returns:
        - Area in cm². Returns -1 if marker not found.
        """
        wound_pixels = np.sum(wound_mask > 0)
        marker_pixels = np.sum(marker_mask > 0)
        
        if marker_pixels < 100: # Safety threshold: Marker too small or missing
            return -1.0
            
        pixel_ratio = wound_pixels / marker_pixels
        real_area = pixel_ratio * WoundMeasurement.REFERENCE_MARKER_AREA_CM2
        return round(real_area, 2)

    @staticmethod
    def get_reference_marker_mask(image_rgb: np.ndarray) -> np.ndarray:
        """
        Heuristic: Detect Green Sticker using HSV Color Thresholding.
        (Since we removed the ML-based marker detector to save time/compute).
        """
        hsv = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2HSV)
        
        # Define Green color range (Adjust based on your specific sticker)
        lower_green = np.array([40, 40, 40])
        upper_green = np.array([80, 255, 255])
        
        mask = cv2.inRange(hsv, lower_green, upper_green)
        
        # Morphological clean up (remove noise dots)
        kernel = np.ones((5,5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        return mask

class HealingTrajectory:
    """
    Tracks progress over time.
    """
    
    @staticmethod
    def calculate_progress(history: List[Dict]) -> Dict:
        """
        Args:
        - history: List of dicts [{'date': '2023-01-01', 'area': 10.5}, ...]
                   Assumed sorted by date.
        
        Returns:
        - percent_reduction: % change from baseline (first visit).
        - velocity: cm²/week reduction rate.
        - status: "Healing", "Stalled", or "Deteriorating".
        """
        if len(history) < 2:
            return {"status": "Insufficient Data"}
            
        baseline = history[0]
        current = history[-1]
        
        # 1. Percent Reduction
        # Formula: (Area_Initial - Area_Current) / Area_Initial
        delta_area = baseline['area'] - current['area']
        pct_reduction = (delta_area / baseline['area']) * 100
        
        # 2. Healing Velocity (cm2 / week)
        d1 = datetime.strptime(baseline['date'], "%Y-%m-%d")
        d2 = datetime.strptime(current['date'], "%Y-%m-%d")
        weeks = (d2 - d1).days / 7.0
        
        if weeks < 0.1: weeks = 0.1 # Prevent div/0
        velocity = delta_area / weeks
        
        # 3. Clinical Status Rules
        if pct_reduction < 0:
            status = "Deteriorating"  # Critical Alert: Wound got bigger
        elif 0 <= pct_reduction < 15 and weeks > 2:
            status = "Stalled"        # Warning: <15% reduction in 2 weeks is a bad sign
        else:
            status = "Healing"        # On track
            
        return {
            "current_area": current['area'],
            "percent_reduction": round(pct_reduction, 1),
            "velocity_cm2_week": round(velocity, 2),
            "status": status
        }
