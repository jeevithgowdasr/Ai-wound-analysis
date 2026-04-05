import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; // Dynamic URL for deployment

export interface AnalysisResponse {
    patient_id: string;
    analysis_date: string;
    metrics: {
        area_cm2: number;
        percent_reduction: number;
        velocity_cm2_week: number;
        healing_status: string;
    };
    tissue_analysis: {
        slough_pct: number;
        risk_level: string;
        redness_index: number;
    };
    healing_score: number;
    healing_grade: string;
    score_explanation: string[];
    patient_summary: string;
    doctor_note: string;
    mask_url?: string;
}

export const analyzeWound = async (file: File, patientId: string = "patient_123"): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    // In a real app, patient_id would come from auth context
    // Here we pass it as a query param or part of formData depending on backend
    // Our backend expects patient_id as query param
    const response = await axios.post(`${API_URL}/analyze?patient_id=${patientId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};
