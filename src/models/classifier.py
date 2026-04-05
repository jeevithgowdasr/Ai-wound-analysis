import torch
import torch.nn as nn
from torchvision import models

class WoundClassifier(nn.Module):
    """
    Binary Classification Model: Healing vs. Infected.
    
    Architecture: EfficientNet-B0
    - Why? 
      1. State-of-the-art accuracy/parameter ratio.
      2. Much smaller and faster than ResNet50 (5.3M params vs 25M).
      3. ideal for small datasets where overfitting is the main risk.
    """
    def __init__(self, pretrained=True):
        super(WoundClassifier, self).__init__()
        
        # Load Pre-trained weights (Transfer Learning)
        # Weights='DEFAULT' downloads the best available ImageNet weights
        weights = models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
        self.backbone = models.efficientnet_b0(weights=weights)
        
        # Replace the Classifier Head
        # EfficientNet's classifier is a Sequential block. We replace it to match our binary output.
        # Original: (dropout): Dropout(p=0.2), (fc): Linear(1280, 1000)
        num_features = self.backbone.classifier[1].in_features
        
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=0.5), # Increased dropout for small dataset regularization
            nn.Linear(num_features, 1) # 1 Output node (Logit) -> Sigmoid -> Probability
        )

    def forward(self, x):
        return self.backbone(x)

    def get_training_strategy(self):
        """
        Returns the text description of the recommended training strategy.
        """
        return """
        TRAINING STRATEGY FOR SMALL DATASETS & LIGHTING ROBUSTNESS:
        
        1. Two-Stage Training (Fine-Tuning):
           - Stage 1: Freeze the 'backbone' layers. Train ONLY the 'classifier' head for ~5 epochs.
             (LR = 1e-3). This prevents destroying pre-trained features with random gradients.
           - Stage 2: Unfreeze all layers. Train with very low learning rate (LR = 1e-5).
        
        2. Lighting Robustness via Augmentation (Crucial):
           since we claimed 'Lighting Robustness', we MUST apply these transforms during training:
           - ColorJitter(brightness=0.2, contrast=0.2, saturation=0.1, hue=0.05)
           - RandomGrayscale(p=0.1)
           - This forces the model to ignore specific color casts (e.g., yellow lamp light) 
             and focus on structural/textural features of infection (redness, swelling patterns).
        
        3. Handling Class Imbalance (Infection is usually rare):
           - Use `BCEWithLogitsLoss(pos_weight=tensor([weight]))`
           - Calculate weight as (Num_Healing / Num_Infected).
        """

# Example Loss Wrapper
def get_loss_function(pos_weight=1.0):
    # pos_weight allows us to penalize missing an infection more than false alarming
    return nn.BCEWithLogitsLoss(pos_weight=torch.tensor([pos_weight]))
