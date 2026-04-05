import cv2
import numpy as np
from PIL import Image, ImageOps

class WoundPreprocessor:
    """
    Preprocessing pipeline for wound images before ML ingestion.
    Standardizes input quality and protects patient privacy.
    """

    def __init__(self, target_size=(512, 512)):
        self.target_size = target_size

    def process_image(self, image_path: str, output_path: str = None) -> np.ndarray:
        """
        Full pipeline: Load -> Anonymize -> Resize -> Denoise -> Enhance -> Output
        """
        # 1. Anonymization (Metadata Stripping)
        # We load using PIL to safely handle EXIF, then convert to generic Numpy
        # This drops all EXIF tags (GPS, Date, Patient ID in comments)
        with Image.open(image_path) as img:
            img = ImageOps.exif_transpose(img) # Handle rotation info before stripping
            img_rgb = np.array(img.convert("RGB"))

        # 2. Resize
        # Bilinear interpolation for images. 
        # Prevents providing massive 12MP images to the model.
        img_resized = cv2.resize(img_rgb, self.target_size, interpolation=cv2.INTER_LINEAR)

        # 3. Background Noise Removal (Denoising)
        # Bilateral Filter: Highly recommended for wounds.
        # It smooths grain/noise while strictly PRESERVING EDGES (unlike Gaussian blur).
        # Crucial for maintaining the sharp boundary between wound and skin.
        img_denoised = cv2.bilateralFilter(img_resized, d=9, sigmaColor=75, sigmaSpace=75)

        # 4. Lighting/Color Normalization
        # CLAHE (Contrast Limited Adaptive Histogram Equalization)
        # Standardizes lighting. If a photo is taken in a dark room, this brings out details.
        # We apply it to the Luminance (L) channel in LAB color space.
        lab = cv2.cvtColor(img_denoised, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        img_normalized = cv2.cvtColor(limg, cv2.COLOR_LAB2RGB)

        # Output or Return
        if output_path:
            # Save using OpenCV (w/o metadata)
            # define RGB -> BGR for opencv write
            cv2.imwrite(output_path, cv2.cvtColor(img_normalized, cv2.COLOR_RGB2BGR))
        
        return img_normalized

    def process_mask(self, mask_path: str) -> np.ndarray:
        """
        Special separate pipeline for Masks (Nearest Neighbor resizing)
        to prevent introducing new classes (e.g. 0.5) via interpolation.
        """
        mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
        mask_resized = cv2.resize(mask, self.target_size, interpolation=cv2.INTER_NEAREST)
        
        # Binarize strictly to 0 and 1 (or 255)
        _, mask_bin = cv2.threshold(mask_resized, 127, 255, cv2.THRESH_BINARY)
        
        return mask_bin
