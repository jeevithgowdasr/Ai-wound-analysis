import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms as T
import albumentations as A
from albumentations.pytorch import ToTensorV2
from pathlib import Path
import cv2
import numpy as np
import random
import os
from tqdm import tqdm

from src.models.unet import WoundSegmenter, WoundLoss, compute_metrics

# --- Reproducibility Setup ---
def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    # Ideally set deterministic=True for perfect reproducibility, 
    # but it slows down training significantly.
    torch.backends.cudnn.deterministic = False 
    torch.backends.cudnn.benchmark = True

# --- Dataset Class ---
class WoundDataset(Dataset):
    def __init__(self, images_dir, masks_dir, transform=None):
        self.images_dir = Path(images_dir)
        self.masks_dir = Path(masks_dir)
        self.ids = [f.name for f in self.images_dir.glob('*') if f.suffix in ['.jpg', '.png']]
        self.transform = transform

    def __len__(self):
        return len(self.ids)

    def __getitem__(self, idx):
        file_name = self.ids[idx]
        img_path = str(self.images_dir / file_name)
        # Assuming mask has same filename but png extension
        mask_name = Path(file_name).with_suffix('.png').name
        mask_path = str(self.masks_dir / mask_name)

        image = cv2.imread(img_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
        # Binary thresholding to ensure 0/1 (float for simple math later)
        mask = (mask > 127).astype(np.float32)

        if self.transform:
            augmented = self.transform(image=image, mask=mask)
            image = augmented['image']
            mask = augmented['mask']
            
            # Albumentations doesn't auto-add channel dim to mask if it's (H,W)
            # We need (1, H, W) for PyTorch
            if mask.ndim == 2:
                mask = mask.unsqueeze(0)

        return image, mask

# --- Training Loop ---
def train_model(data_dir='./data/processed', epochs=20, batch_size=8, lr=1e-4, device='cuda'):
    
    set_seed(42)
    device = torch.device(device if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")

    # 1. Pipeline: Augmentation
    # Uses Albumentations for coordinated image+mask transforms
    train_transform = A.Compose([
        A.Rotate(limit=35, p=0.5),
        A.HorizontalFlip(p=0.5),
        A.RandomBrightnessContrast(p=0.2),
        A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ToTensorV2()
    ])

    val_transform = A.Compose([
        A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ToTensorV2()
    ])

    # 2. Data Loading
    train_ds = WoundDataset(
        f"{data_dir}/train/images", 
        f"{data_dir}/train/masks", 
        transform=train_transform
    )
    val_ds = WoundDataset(
        f"{data_dir}/val/images", 
        f"{data_dir}/val/masks", 
        transform=val_transform
    )

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=2)

    # 3. Model & Optimization
    model = WoundSegmenter().to(device)
    criterion = WoundLoss()
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-5)
    
    # LR Scheduler: Reduce LR if validation loss plateaus
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=3)

    best_val_iou = 0.0
    
    # 4. Training Loop
    for epoch in range(epochs):
        model.train()
        train_loss = 0
        
        pbar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{epochs}")
        for images, masks in pbar:
            images = images.to(device)
            masks = masks.to(device)

            optimizer.zero_grad()
            logits = model(images)
            loss = criterion(logits, masks)
            loss.backward()
            optimizer.step()

            train_loss += loss.item()
            pbar.set_postfix({'loss': loss.item()})

        # 5. Validation
        model.eval()
        val_loss = 0
        val_iou = 0
        with torch.no_grad():
            for images, masks in val_loader:
                images = images.to(device)
                masks = masks.to(device)
                
                logits = model(images)
                loss = criterion(logits, masks)
                val_loss += loss.item()
                
                metrics = compute_metrics(logits, masks)
                val_iou += metrics['iou']

        avg_train_loss = train_loss / len(train_loader)
        avg_val_loss = val_loss / len(val_loader)
        avg_val_iou = val_iou / len(val_loader)
        
        print(f"Epoch {epoch+1} Results: Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f} | Val IoU: {avg_val_iou:.4f}")

        # 6. Checkpointing
        scheduler.step(avg_val_loss)
        if avg_val_iou > best_val_iou:
            best_val_iou = avg_val_iou
            torch.save(model.state_dict(), "best_model.pth")
            print(f"Saved New Best Model (IoU: {best_val_iou:.4f})")

if __name__ == "__main__":
    # Ensure directories exist to prevent crash
    # (In real usage, data must be present)
    if os.path.exists("./data/processed/train/images"):
        train_model()
    else:
        print("Data directory not found. Please run preprocessing first.")
