# WoundSense AI - Architecture & Tech Stack

## Architectural Overview
The system follows a **Hybrid Architecture**:
*   **State & Data:** Managed by a Backend-as-a-Service (BaaS) for speed and security.
*   **Compute & Intelligence:** Managed by a custom Python microservice for image processing.

## 1. Frontend: **React (via Vite)**
*   **Choice:** React + TypeScript + Tailwind CSS.
*   **Justification:**
    *   **Vite:** Instant server start, essential for rapid 6-week iteration.
    *   **PWA Capable:** can be installed on phones as a "web app" to access the camera, avoiding the complexity of React Native/Flutter for the PoC.
    *   **Tailwind:** Rapid UI application without writing custom CSS files.

## 2. Backend (AI Service): **FastAPI (Python)**
*   **Choice:** FastAPI.
*   **Justification:**
    *   **Native Async:** Handles multiple image upload requests effectively while waiting for model inference.
    *   **Pydantic:** strict type validation ensures data integrity between the frontend and the AI.
    *   **Ecosystem:** First-class citizen support for PyTorch/Numpy/OpenCV.

## 3. Machine Learning Framework: **PyTorch**
*   **Library:** `segmentation-models-pytorch` (SMP).
*   **Choice:** U-Net architecture with a `MobileNetV2` backbone.
*   **Justification:**
    *   **SMP:** Provides pre-trained architectures out-of-the-box. We don't need to write U-Net from scratch.
    *   **MobileNetV2:** Lightweight. Can eventually run *on-device* (browser/mobile) if we move to ONNX later.
    *   **PyTorch:** Dynamic graph makes debugging image tensor shapes significantly easier than TensorFlow.

## 4. Data Layer (BaaS): **Supabase**
*   **Choice:** Supabase (Open Source Firebase alternative).
*   **Components:**
    *   **PostgreSQL:** Relational DB for `Patients`, `Wounds`, and `Measurements` tables.
    *   **Storage (S3-compatible):** Securely handling raw wound images and generated mask overlays.
    *   **Auth:** Handles user signup/login secure JWTs out of the box.
*   **Justification:** Using Supabase eliminates writing 50% of the backend code (Auth, File Upload handling, CRUD APIs), allowing us to focus purely on the AI logic.

## 5. Deployment strategy
*   **Frontend:** Vercel or Netlify (Zero config CI/CD connected to Git).
*   **Backend (AI):** Dockerized container on **Google Cloud Run** or **Render**.
    *   *Stateless scaling:* The AI service scales down to 0 when not in use (cost-effective) and scales up when traffic spikes.
    *   *Docker:* Ensures the specific Python/CV2 dependencies match exactly between dev and prod.

## Data Flow
1.  **React App** authenticates via **Supabase**.
2.  User uploads image -> stored directly to **Supabase Storage**.
3.  **Supabase** triggers a webhook OR **React App** calls **FastAPI** with the image URL.
4.  **FastAPI** downloads image -> Runs Pre-processing (Color Thresh for Marker) -> Runs ML Inference (U-Net).
5.  **FastAPI** calculates Area -> Updates **Supabase DB** with the result.
6.  **React App** listens for the DB change and displays the result.
