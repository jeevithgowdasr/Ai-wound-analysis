import sys
from pathlib import Path
# Add project root to sys.path to allow importing from 'src'
sys.path.append(str(Path(__file__).resolve().parents[2]))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import cv2
import numpy as np
import base64
from datetime import datetime
import shutil
import os

from backend.app.schemas import AnalysisResponse, HealingMetrics, TissueAnalysisResult
from src.preprocessing.transforms import WoundPreprocessor
from src.models.unet import WoundSegmenter
from src.models.classifier import WoundClassifier
from src.inference.postprocess import WoundMeasurement, HealingTrajectory
from src.inference.healing_score import HealingScore
from src.inference.patient_report import PatientReportGenerator
from src.inference.doctor_report import DoctorReportGenerator
from src.inference.tissue_analysis import TissueAnalysis

app = FastAPI(title="WoundSense AI API", version="0.1.0")

# CORS (Allow Frontend to talk to Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Model Instances (Load once on startup for scalability)
segmenter = None
classifier = None
preprocessor = None

@app.on_event("startup")
def load_models():
    global segmenter, classifier, preprocessor
    print("Loading AI Models...")
    # In a real app, load state_dict here
    segmenter = WoundSegmenter() 
    classifier = WoundClassifier()
    preprocessor = WoundPreprocessor()
    print("Models Loaded.")

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_wound(patient_id: str, file: UploadFile = File(...)):
    """
    Orchestrates the Full AI Pipeline:
    1. Save & Preprocess Image
    2. Run Segmentation (Area)
    3. Run Classification (Infection)
    4. Run Tissue Analysis (Slough/Redness)
    5. Calculate Scores & Reports
    """
    
    # 1. Secure File Handling
    # Save to temp file to process with OpenCV
    temp_filename = f"temp_{patient_id}_{datetime.now().timestamp()}.jpg"
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. Preprocessing
        # Privacy: We process the image and extract distinct numbers.
        # We assume the preprocessor strips metadata.
        img_processed = preprocessor.process_image(temp_filename)
        
        # 3. Inference (Mocking tensor outputs for Protocol correctness)
        # In real code: input_tensor = torch.from_numpy(img_processed)... output = model(input_tensor)
        
        # Mocking Segmenter mask (Simulation)
        dummy_mask = np.zeros((512, 512), dtype=np.uint8)
        cv2.circle(dummy_mask, (256, 256), 100, 1, -1) # A perfect circle wound
        
        # Mocking Marker mask
        dummy_marker_mask = np.zeros((512, 512), dtype=np.uint8)
        cv2.circle(dummy_marker_mask, (50, 50), 20, 1, -1) # A marker in corner
        
        # Mocking Classification Prob
        infection_prob = 0.25 
        
        # 4. Measurements
        area = WoundMeasurement.calculate_area(dummy_mask, dummy_marker_mask)
        
        # Mock Historical Data for Trajectory (Retrieving from DB in real app)
        history = [
            {'date': '2023-10-01', 'area': area + 2.5}, # It was bigger before
            {'date': '2023-10-15', 'area': area}
        ]
        trajectory = HealingTrajectory.calculate_progress(history)
        
        # 5. Tissue Analysis
        tissue_stats = TissueAnalysis.detect_exudate_slough(img_processed, dummy_mask)
        redness = TissueAnalysis.calculate_redness_index(img_processed, dummy_mask)
        
        # 6. Scoring
        score_data = HealingScore.calculate_score(
            area_reduction_pct=trajectory['percent_reduction'],
            infection_probability=infection_prob,
            slough_pct=tissue_stats['percent_slough']
        )
        
        # 7. LLM-Enhanced Reporting (New Integration)
        from src.inference.llm_engine import LLMEngine
        
        llm_metrics = {
            'area_cm2': area,
            'slough_pct': tissue_stats['percent_slough'],
            'redness_index': redness,
            'healing_velocity': trajectory['velocity_cm2_week'],
            'infection_prob': infection_prob
        }
        
        llm_output = LLMEngine.generate_comprehensive_report(
            metrics=llm_metrics,
            patient_id=patient_id,
            history=history
        )
        
        return AnalysisResponse(
            patient_id=patient_id,
            analysis_date=str(datetime.now().date()),
            metrics=HealingMetrics(
                area_cm2=area,
                percent_reduction=trajectory['percent_reduction'],
                velocity_cm2_week=trajectory['velocity_cm2_week'],
                healing_status=trajectory['status']
            ),
            tissue_analysis=TissueAnalysisResult(
                slough_pct=tissue_stats['percent_slough'],
                risk_level=tissue_stats['risk_level'],
                redness_index=redness
            ),
            healing_score=score_data['score'],
            healing_grade=score_data['grade'],
            score_explanation=llm_output['recommendations'], # Using AI recommendations here
            patient_summary=llm_output['patient_summary'],
            doctor_note=llm_output['doctor_note'],
            mask_url="http://mock-storage/mask.png" # Placeholder
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup Privacy: Delete temp image
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
