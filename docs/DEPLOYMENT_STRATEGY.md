# Scalable Deployment Strategy: WoundSense AI

## 1. High-Level Architecture (The "Three-Tier" Scale)

### Tier 1: The Global Edge (Frontend)
*   **Strategy:** Static Site Generation (SSG) / Client-side Rendering (CSR).
*   **Host:** **Vercel** or **AWS CloudFront**.
*   **Scalability:** Infinite. Served from edge nodes globally. Using a CDN ensures the app loads in <1s for rural users even with slow 3G connections.
*   **Cost:** Near zero for static assets.

### Tier 2: The Logic Core (API & Orchestration)
*   **Strategy:** Containerized Stateless Microservices.
*   **Host:** **Google Cloud Run** or **AWS Fargate** (Serverless Containers).
*   **Autoscaling:**
    *   *Min Instances:* 1 (Keep warm during business hours).
    *   *Max Instances:* 100+ (Scale based on CPU/Request count).
    *   *Behavior:* If 1000 nurses upload photos at 9:00 AM, Cloud Run spins up 50 containers. At 9:30 AM, it drops back to 1.
*   **Load Balancing:** Handled automatically by the Platform (GCP/AWS).

### Tier 3: The Heavy Lifter (AI Inference Engine)
*   **Challenge:** Model inference (U-Net) is CPU/RAM intensive.
*   **Scaling Pattern:** **Asynchronous Task Queue** (The "Starbucks" Model).
    *   *Direct (PoC):* User waits 2s for response. Simple, but blocks the server.
    *   *Scalable (Prod):*
        1.  API receives image -> Pushes ID to **Redis Queue**.
        2.  API returns "Processing..." (202 Accepted).
        3.  **Worker Nodes** (Python/Celery) pull job, load model, run inference.
        4.  Worker updates DB with result.
        5.  Frontend polls/subscribes to DB for "Done" status.
*   **Hardware:**
    *   *MobileNetV2 (Current):* Efficient enough for **CPU Inference**. Cheaper/Easier.
    *   *Future (Transformers):* Switch workers to **GPU Instances** (NVIDIA T4).

## 2. Data Strategy (Growth Management)

### Database (PostgreSQL)
*   **Vertical Scaling:** Start with 2 vCPU / 4GB RAM. Upgrade as needed.
*   **Horizontal Scaling (Sharding):**
    *   Partition `measurements` table by `Year` or `Region`.
    *   Archive "Inactive wonds" (>1 year old) to cold storage (CSV/Parquet) to keep indexing fast.

### Object Storage (Images)
*   **Host:** Supabase Storage (S3 wrapper).
*   **Growth:** Images are heavy.
*   **Lifecycle Policy:**
    *   *Hot:* Recent upload (30 days). Standard S3.
    *   *Warm:* Active wound tracking (1 year). Standard S3.
    *   *Cold:* Closed cases. Move to **S3 Glacier Deep Archive** ($0.00099/GB/mo) for compliance retention (7 years).

## 3. Deployment Pipeline (CI/CD)

1.  **Code Commit (GitHub):** Developer pushes code.
2.  **Test (GitHub Actions):** Runs `pytest` (Unit tests) & Linting.
3.  **Build:**
    *   Builds Frontend Static files.
    *   Builds Backend Docker Image -> Pushes to **Container Registry**.
4.  **Deploy (Staging):** Auto-deploys to `staging.woundsense.ai`.
5.  **Integration Test:** Runs synthetic image through API to verify 200 OK.
6.  **Promote (Production):** Manual approval -> Deploys to `app.woundsense.ai`.

## 4. Cost vs Performance Matrix

| Level | Strategy | Est. Cost | Capacity |
| :--- | :--- | :--- | :--- |
| **PoC (Current)** | Monolithic Docker (API+AI), Sync Inference | Free / <$50 | ~10 concurrent users |
| **Pilot** | Cloud Run (CPU), Managed DB | ~$100/mo | ~500 concurrent users |
| **Enterprise** | K8s Cluster, GPU Workers, Redis Queue | ~$1k+/mo | 100k+ concurrent users |
