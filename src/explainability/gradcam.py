import torch
import torch.nn.functional as F
import cv2
import numpy as np
import matplotlib.pyplot as plt

class WoundGradCAM:
    """
    Grad-CAM (Gradient-weighted Class Activation Mapping) for Wound Classification.
    
    HOW IT WORKS:
    1. Hook the final convolutional layer of the EfficientNet backbone.
    2. Forward pass: Get the logits.
    3. Backward pass: Calculate gradients of the 'Infection' class score with respect to feature maps.
    4. Weighting: Average the gradients to get importance weights for each feature map.
    5. Heatmap: Weighted sum of feature maps -> ReLU -> Upsample to image size.
    """
    
    def __init__(self, model, target_layer=None):
        self.model = model.eval()
        # Default to the last feature block of EfficientNet-B0 if not specified
        # In torchvision efficientnet, features is a container, [-1] is the last block
        self.target_layer = target_layer if target_layer else model.backbone.features[-1]
        
        self.gradients = None
        self.activations = None
        
        # Register hooks
        self._register_hooks()

    def _register_hooks(self):
        def forward_hook(module, input, output):
            self.activations = output
            
        def backward_hook(module, grad_in, grad_out):
            self.gradients = grad_out[0]
            
        self.target_layer.register_forward_hook(forward_hook)
        self.target_layer.register_backward_hook(backward_hook)

    def generate_heatmap(self, input_tensor, target_class=None):
        """
        Generates the raw heatmap for a specific input tensor.
        """
        # 1. Forward Pass
        output = self.model(input_tensor)
        
        if target_class is None:
            # If binary (1 output), we target index 0. If multiclass, max idx.
            target_class = 0 
        
        # 2. Backward Pass
        self.model.zero_grad()
        
        # For Binary Classification (1 logit):
        # We want to explain why the score is HIGH (Infected).
        score = output[0, target_class]
        score.backward()
        
        # 3. Generate CAM
        gradients = self.gradients
        activations = self.activations
        
        # Global Average Pooling of Gradients (Weights)
        weights = torch.mean(gradients, dim=(2, 3), keepdim=True)
        
        # Weighted sum of feature maps
        cam = torch.sum(weights * activations, dim=1, keepdim=True)
        
        # ReLU (We only care about pixels that have a POSITIVE influence on the class)
        cam = F.relu(cam)
        
        # Normalize to 0-1
        cam = cam - cam.min()
        cam = cam / (cam.max() + 1e-7)
        
        return cam.detach().cpu().numpy()[0, 0]

    @staticmethod
    def overlay_heatmap(image_np, heatmap, alpha=0.5, colormap=cv2.COLORMAP_JET):
        """
        Project the small 7x7 heatmap onto the 512x512 original image.
        """
        # Resize heatmap to match image dimensions
        heatmap_resized = cv2.resize(heatmap, (image_np.shape[1], image_np.shape[0]))
        
        # Apply color map
        heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), colormap)
        heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
        
        # Blend
        overlay = (alpha * heatmap_colored + (1 - alpha) * image_np).astype(np.uint8)
        return overlay

    def explain(self, input_tensor, original_image):
        """
        Full wrapper: Input Tensor -> Heatmap Overlay
        """
        heatmap = self.generate_heatmap(input_tensor)
        overlay = self.overlay_heatmap(original_image, heatmap)
        return overlay

"""
--- CLINICAL INTERPRETATION ---
1. RED HOTZONES: 
   - These are the pixels that convinced the AI to classify this as "Infected".
   - Clinician Check: Are the red zones actually on the wound bed (e.g., Slough/Pus)? 
   - Error Check: If the red zone is on the background (e.g., a red blanket), the AI is hallucinating/biased.

--- LIMITATIONS ---
1. Resolution: The heatmap is upsampled from a tiny feature map (e.g., 7x7), so it's coarse "blob" detection, not pixel-perfect segmentation.
2. Correlation vs Causation: It shows WHERE the model looked, not necessarily WHAT feature (texture/color) it saw.
3. Reliability: A model can be right for the wrong reasons. Grad-CAM exposes this (e.g. classifying infection based on a ruler in the frame).
"""
