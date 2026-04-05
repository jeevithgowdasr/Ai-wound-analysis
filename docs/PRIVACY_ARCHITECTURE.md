# Privacy-First Architecture for WoundSense AI

## 1. Minimal Data Collection Principle
*   **No Facial Recognition:** The UI guides users to photograph *only* the wound. If a face is inadvertently detected, the image is rejected at the client-side (future feature).
*   **Metadata Stripping:** All EXIF data (GPS, Date, Device ID) is stripped from images *in memory* before any processing or permanent storage occurs. (Implemented in `src.preprocessing.transforms`).
*   **De-identified Storage:** Images are stored with random UUID filenames (e.g., `550e8400-e29b....jpg`) with NO link to the patient's name in the filename. The mapping exists *only* in the secure database.

## 2. Encryption Strategy
*   **In Transit:** All data transmission (Mobile <-> API <-> DB) occurs strictly over **TLS 1.3** (HTTPS). Access is blocked for non-HTTPS requests.
*   **At Rest (Database):** The PostgreSQL database (Supabase) utilizes transparent disk-level encryption (AES-256).
*   **At Rest (Images):** Object buckets are encrypted by default. Access requires signed ephemeral URLs (valid for 15 minutes), preventing "public bucket" leaks.

## 3. Access Control (RBAC)
We implement Row-Level Security (RLS) in the Database:
*   **Patient Role:**
    *   Can `INSERT` images into their *own* `assessments` table.
    *   Can `SELECT` only their *own* records.
    *   Cannot access any other patient's data.
*   **Clinician Role:**
    *   Can `SELECT` records for patients specifically *assigned* to their care unit.
    *   Can `UPDATE` logical fields (e.g., `clinician_notes`).
    *   Cannot `DELETE` records (preserves medical history).
*   **AI Service Role:**
    *   Has restricted service-account access to read new images and write to the `ai_metrics` table only.

## 4. Auditability & Compliance
*   **Immutable Logs:** Every `SELECT` query on the `images` table is logged in a separate tamper-proof Audit Table.
    *   *Log Entry:* `Timestamp | UserID | Action (VIEW_IMAGE) | ResourceID | IP_Address`
*   **Model Versioning:** The `ai_metrics` table stores the specific `model_version` used. This ensures that if a diagnosis is challenged in court/audit 2 years later, we can reproduce the *exact* AI behavior from that day.
*   **Right to Erasure (GDPR):** A specialized workflow exists to "hard delete" a patient's database rows and associated image objects upon verified request, generating a "Deletion Certificate".

## 5. Ephemeral Processing
*   **RAM-only Pipeline:** The FastAPI backend processes images in RAM or temporary files that are strictly scoped to the request lifecycle.
*   **Auto-Cleanup:** The `finally` block in the API code ensures immediate deletion of temporary artifacts, even if the server crashes.
