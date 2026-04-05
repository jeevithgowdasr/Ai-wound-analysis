import torch
import segmentation_models_pytorch as smp
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

class Evaluator:
    """
    Central Evaluation Hub for Clinical ML Metics.
    Translates raw numbers into clinical performance indicators.
    """

    @staticmethod
    def evaluate_segmentation(pred_mask, true_mask):
        """
        Metrics for Wound Boundary Detection (Segmentation)
        
        1. IoU (Intersection over Union) / Jaccard Index: 
           - Clinical Meaning: "Overlap Quality". How widely did the AI miss the real wound edge? 
           - Target: > 0.75 is strong alignment.
        
        2. Dice Coefficient (F1 Score):
           - Clinical Meaning: Harmonic mean of precision and recall. 
           - Why? Takes into account that the 'Wound' is a tiny part of the 'Image'. 
             A model that says "everything is skin" gets 99% accuracy but 0% Dice.
             
        3. Hausdorff Distance (Optional extension, not calculated here):
           - Clinical Meaning: The maximum error margin. "Did the AI overshoot the wound edge by 2mm or 2cm?"
        """
        # Ensure inputs are binary tensors (0 or 1)
        pred_bin = (pred_mask > 0.5).long()
        true_bin = (true_mask > 0.5).long()
        
        tp, fp, fn, tn = smp.metrics.get_stats(pred_bin, true_bin, mode='binary')
        
        return {
            "iou": smp.metrics.iou_score(tp, fp, fn, tn, reduction="micro-imagewise").item(),
            "dice": smp.metrics.f1_score(tp, fp, fn, tn, reduction="micro-imagewise").item()
        }

    @staticmethod
    def evaluate_classification(pred_probs, true_labels, threshold=0.5):
        """
        Metrics for Infection Detection (Classification)
        
        1. Sensitivity (Recall):
           - Clinical Meaning: "Safety". If a patient HAS an infection, did we catch it?
           - CRITICAL: Missing an infection (False Negative) is dangerous. We want Recall -> 1.0.
           
        2. Specificity:
           - Clinical Meaning: "False Alarm Rate". If a patient is healthy, did we scare them?
           - Low specificity leads to "Alert Fatigue" for doctors.
           
        3. AUROC (Area Under ROC Curve):
           - Clinical Meaning: "Discriminative Power". How well does the model assume 'Infected' scores 
             are higher than 'Healthy' scores, regardless of the strict 0.5 threshold?
        """
        # Convert lists/tensors to numpy
        if isinstance(pred_probs, torch.Tensor):
            pred_probs = pred_probs.detach().cpu().numpy()
        if isinstance(true_labels, torch.Tensor):
            true_labels = true_labels.detach().cpu().numpy()
            
        preds = (pred_probs > threshold).astype(int)
        
        return {
            "sensitivity": recall_score(true_labels, preds), # Recall
            "specificity": recall_score(true_labels, preds, pos_label=0), # Recall of the negative class
            "precision": precision_score(true_labels, preds, zero_division=0),
            "f1": f1_score(true_labels, preds),
            "auroc": roc_auc_score(true_labels, pred_probs)
        }
