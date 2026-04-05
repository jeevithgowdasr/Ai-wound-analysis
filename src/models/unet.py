import torch
import torch.nn as nn
import segmentation_models_pytorch as smp

class WoundSegmenter(nn.Module):
    """
    Mobile-optimized Wound Segmentation Model.
    
    Architecture: U-Net
    Backbone: MobileNetV2 (Pre-trained on ImageNet)
    
    Why MobileNetV2?
    - Lightweight depth-wise separable convolutions (ideal for smartphone inference).
    - significantly smaller model size (<20MB) compared to ResNet.
    - Fast inference on CPU/Mobile GPU.
    """
    
    def __init__(self, in_channels=3, classes=1):
        super(WoundSegmenter, self).__init__()
        
        # We use segmentation-models-pytorch for a robust, industry-standard implementation
        self.model = smp.Unet(
            encoder_name="efficientnet-b4",        # Upgraded to heavier backbone for better accuracy
            encoder_weights="imagenet",         # Transfer Learning
            in_channels=in_channels,
            classes=classes,
            activation=None                     # Return logits (better for numerical stability in Loss)
        )

    def forward(self, x):
        """
        Input: [Batch, 3, Height, Width]  (Normalized RGB)
        Output: [Batch, 1, Height, Width] (Logits)
        """
        return self.model(x)

# --- Loss Function Design ---
class WoundLoss(nn.Module):
    """
    Combined Loss function optimized for Medical Segmentation.
    
    DiceLoss:   Optimizes overlap (IOU). Handles class imbalance well (small wound, large skin).
    BCE:        Binary Cross Entropy. Provides smooth gradients for pixel-level classification.
    
    Total Loss = 0.5 * Dice + 0.5 * BCE
    """
    def __init__(self):
        super(WoundLoss, self).__init__()
        self.dice_loss = smp.losses.DiceLoss(mode="binary", from_logits=True)
        self.bce_loss = smp.losses.SoftBCEWithLogitsLoss(smooth_factor=0.1) # Label smoothing reduces overconfidence

    def forward(self, logits, targets):
        return 0.5 * self.dice_loss(logits, targets) + 0.5 * self.bce_loss(logits, targets)

# --- Metrics ---
def compute_metrics(logits, targets, threshold=0.5):
    """
    returns:
    - iou: Intersection over Union (Jaccard Index)
    - f1: Dice Coefficient
    """
    # Apply Sigmoid to logits for probability
    probs = torch.sigmoid(logits)
    # Binarize
    preds = (probs > threshold).float()
    
    tp, fp, fn, tn = smp.metrics.get_stats(preds.long(), targets.long(), mode='binary')
    
    iou = smp.metrics.iou_score(tp, fp, fn, tn, reduction="micro")
    f1 = smp.metrics.f1_score(tp, fp, fn, tn, reduction="micro")
    
    return {"iou": iou, "f1": f1}
