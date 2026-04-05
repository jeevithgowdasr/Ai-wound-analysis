-- Database Schema for WoundSense AI (PostgreSQL / Supabase)

-- 1. Patients Table
-- Core demographic identity. Separated from User Auth table for privacy.
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_of_birth DATE, -- Required for age-related healing factors
    gender TEXT,
    medical_history JSONB -- Stores diabetes status, smoker status, etc.
);

-- 2. Wounds Table (The "Case")
-- A patient may have multiple concurrent wounds (e.g., 'Left Heel' and 'Sacrum').
-- Each wound is tracked faithfully as a separate entity over time.
CREATE TABLE wounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    location_body_part TEXT NOT NULL, -- e.g., "Left Heel"
    wound_type TEXT, -- e.g., "Diabetic Ulcer", "Pressure Ulcer", "Surgical"
    onset_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Assessments Table (The Longitudinal Event)
-- Represents a single point-in-time capture event (User uploads photo).
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wound_id UUID REFERENCES wounds(id) ON DELETE CASCADE,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Storage Paths to artifacts
    original_image_url TEXT NOT NULL,
    processed_mask_url TEXT,
    gradcam_heatmap_url TEXT,
    
    -- Quality Assurance Flags
    image_quality_score FLOAT, -- From Blur detection
    reference_marker_detected BOOLEAN DEFAULT FALSE,
    
    -- Clinical Override (Human-in-the-loop)
    clinician_notes TEXT,
    is_validated BOOLEAN DEFAULT FALSE -- True if doctor reviewed the AI output
);

-- 4. AI Metrics Table
-- Strictly computed data. Separated to allow re-running AI on old images 
-- without altering the Assessment record itself.
CREATE TABLE ai_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    
    -- Morphometrics
    area_surface_cm2 FLOAT, -- The core reliable metric
    width_cm FLOAT,
    length_cm FLOAT,
    
    -- Tissue Composition (0-100)
    percent_granulation FLOAT,
    percent_slough FLOAT,
    percent_necrotic FLOAT,
    
    -- Colorimetry
    redness_index FLOAT,
    
    -- Model Metadata (Vital for FDA/Audit trails)
    model_version TEXT NOT NULL, -- e.g., "v1.0.2-unet-mobilenet"
    confidence_score FLOAT
);

-- Indexes for Dashboard Performance
CREATE INDEX idx_wounds_patient ON wounds(patient_id);
CREATE INDEX idx_assessments_wound ON assessments(wound_id);
CREATE INDEX idx_assessments_date ON assessments(captured_at DESC);
