from pydantic import BaseModel
from typing import List, Optional

class AnalysisRequest(BaseModel):
    patient_id: str
    image_base64: Optional[str] = None # For Base64 uploads
    # In real deployment, might pass a presigned S3 URL instead

class TissueAnalysisResult(BaseModel):
    slough_pct: float
    risk_level: str
    redness_index: float

class HealingMetrics(BaseModel):
    area_cm2: float
    percent_reduction: float
    velocity_cm2_week: float
    healing_status: str # Healing, Stalled, Deteriorating

class AnalysisResponse(BaseModel):
    patient_id: str
    analysis_date: str
    
    # Quantitative
    metrics: HealingMetrics
    tissue_analysis: TissueAnalysisResult
    
    # Scores & Explainability
    healing_score: int # 0-100
    healing_grade: str
    score_explanation: List[str]
    
    # Reports
    patient_summary: str
    doctor_note: str
    
    # Visuals (Base64 or URL)
    mask_url: Optional[str] = None
    gradcam_url: Optional[str] = None
    
    # Privacy
    # We do NOT echo back the raw input image
