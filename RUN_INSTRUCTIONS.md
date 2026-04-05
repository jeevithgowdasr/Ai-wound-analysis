# How to Run WoundSense AI

## Prerequisites
*   Node.js (v18+)
*   Python (v3.9+)

## 1. Start the Backend (API)
Open a terminal in the root folder:

```bash
# Create virtual env (Recommended)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Dependencies
pip install fastapi uvicorn opencv-python-headless numpy torch torchvision segmentation-models-pytorch albumentations pydantic python-multipart

# Run the Server
python -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

*The API will be live at `http://localhost:8000`*
*Docs at `http://localhost:8000/docs`*

## 2. Start the Frontend (App)
Open a **new** terminal in the root folder:

```bash
cd frontend
npm install
npm run dev
```

*The App will be live at `http://localhost:5173`*

## 3. Demo Data
Since you likely don't have the AI models trained (`.pth` files), the backend is configured to **Mock** the AI results for the demo.
*   Upload ANY image in the Capture screen.
*   The system will process it and return a simulated chart/score so you can verify the UX flow.
