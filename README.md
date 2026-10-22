# ChaosResilience — DevOps Resilience Engineering Platform

> **Disclaimer:** This project is an educational proof of concept inspired by Netflix's resilience engineering approach and does not reproduce Netflix's production infrastructure.

---

## 1. Project Overview

**ChaosResilience** is an educational DevOps Chaos Engineering platform. Designed as a proof-of-concept case study, it demonstrates how distributed applications can automatically withstand, detect, and recover from infrastructure outages, container crashes, and service failures.

The platform provides a cinematic, dark-themed observability dashboard coupled with a lightweight REST API control plane. Operators can inject controlled failure scenarios (graceful container termination and abrupt container crashes), observe real-time health probe degradation, verify automated restart mechanisms, and review quantitative recovery metrics.

---

## 2. Problem Statement

In modern cloud-native architectures, failures are inevitable: microservices crash, host nodes exhaust memory, and network partitions occur. Traditional monolithic approaches treat failure as an exceptional catastrophe. 

In contrast, Netflix's Resilience Engineering and Chaos Engineering philosophies (originating with the Simian Army and Chaos Monkey) posit that **failure must be introduced deliberately in controlled environments** to:
1. Validate automated self-healing supervisors.
2. Measure exact Failure Detection Time (FDT) and Recovery Time (RT / MTTR).
3. Prevent cascading failures across downstream dependencies.
4. Verify that client-facing availability is maintained without manual operator intervention.

ChaosResilience implements this feedback loop at a micro-scale for educational demonstration and DevOps coursework.

---

## 3. Architecture

ChaosResilience is structured into two main operational tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CHAOSRESILIENCE TOPOLOGY                        │
└────────────────────────────────────────────────────────────────────────┘

  [ Web Browser / Presenter ]
             │
             │ HTTP Request (Port 3000 or 5173)
             ▼
 ┌───────────────────────────────┐
 │       FRONTEND TIER           │
 │  • React 19 + TypeScript      │
 │  • Vite 8 SPA Bundle          │
 │  • Nginx Alpine Reverse Proxy │
 │  • 600ms Active Polling Loop  │
 └──────────────┬────────────────┘
                │
                │ Reverse Proxy / CORS API Requests
                ▼
 ┌───────────────────────────────┐
 │        BACKEND TIER           │
 │  • Python 3.11+ / Flask 3.1   │
 │  • Chaos Engine State Machine │
 │  • Hardware Timers (FDT/RT)   │
 │  • Endpoints on Port 5000     │
 └──────────────┬────────────────┘
                │
                │ Probe / Health Check (GET /health)
                ▼
 ┌───────────────────────────────┐
 │     DOCKER SUPERVISOR TIER    │
 │  • Docker HEALTHCHECK Probe   │
 │  • Restart Policy: 'always'   │
 │  • Auto-restarts on failure   │
 └───────────────────────────────┘
```

### The Resilience Lifecycle
```
[1. NORMAL] ────────► [2. FAILURE DETECTED] ────────► [3. RECOVERING] ────────► [4. RECOVERED]
• Application: HEALTHY • App: DEGRADED              • Container Restarting    • App: HEALTHY
• Container: RUNNING   • Container: STOPPED         • Policy: 'always'        • Probe: 200 OK
• Probe: 200 OK        • Probe: 503 Unhealthy       • Watchdog active         • Real RT recorded
• Metrics ready        • FDT timer captures outage  • Reconnecting state      • Metrics updated
```

---

## 4. Technologies Used

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8 | Single Page Application, typed components, responsive dashboard |
| **Styling & Icons** | Vanilla CSS Tokens, Glassmorphism, Lucide React | High-contrast Netflix-inspired dark UI, custom HUD indicators |
| **Backend** | Python 3.11+, Flask 3.1, Flask-CORS 6.0 | REST API, probe endpoints, JSON error handlers, CORS support |
| **Resilience Engine** | In-process Thread-Safe `ChaosEngine` | Lifecycle coordination, failure injection, hardware timing |
| **Containerization**| Docker Engine, Docker Compose, Nginx Alpine | Multi-container architecture, healthcheck probes, auto-restart |
| **Testing** | Python `unittest`, Vite build, Node test runner | 10/10 automated API unit tests, TypeScript type-check verification |

---

## 5. Frontend

The frontend is built desktop-first and is fully mobile responsive. Key UI sections include:
- **Navbar:** Sticky navigation with dynamic status pills showing live connection state (`NORMAL (Healthy)`, `Failure Detected`, `Recovering Container...`, `Backend Unavailable`).
- **Hero Section:** Cinematic headline with real-time HUD telemetry counter previews and quick navigation CTA buttons.
- **Live System Status:** 4 live telemetry cards (`Application Status`, `Container Status`, `Health Check`, `Recovery System`) and an interactive 4-phase **Resilience Lifecycle State Bar** (`NORMAL` $\rightarrow$ `FAILURE DETECTED` $\rightarrow$ `RECOVERING` $\rightarrow$ `RECOVERED`).
- **Resilience Metrics:** 4 quantitative telemetry cards displaying real backend calculations (`Recovery Success Rate`, `Average Recovery Time`, `Mean Time to Detect`, `Availability`).
- **Chaos Experiments:** Interactive scenario cards for **Container Stop** (Graceful SIGTERM) and **Container Kill** (Abrupt SIGKILL) with risk badges, parameter breakdown, and modal execution triggers.
- **Recent Experiments:** Live audit table logging every trial with precise detection time, recovery time, status, and ISO UTC timestamps.
- **Resilience Loop Timeline:** 6-step explanatory workflow detailing the automated self-healing cycle.
- **Educational Concept:** Educational overview attributing Netflix's Simian Army and Chaos Engineering principles.

---

## 6. Backend

The backend is implemented in Python and Flask (`backend/app.py` and `backend/chaos_engine.py`):
- **Thread Safety:** Uses `threading.Lock()` to prevent race conditions during experiment execution.
- **Concurrent Request Protection:** Rejects concurrent injection attempts with `HTTP 409 Conflict`.
- **Pure JSON Error Responses:** 404 Not Found, 405 Method Not Allowed, and 500 Internal Error always return structured JSON, never HTML.
- **Health Probe Logic:** `GET /health` evaluates the current engine state, returning `HTTP 200 OK` during steady state and `HTTP 503 Service Unavailable` during active failure injection.

---

## 7. Docker

### Service Definitions (`docker-compose.yml`)
The stack defines two services on an internal bridge network:
1. `backend`:
   - Builds from `backend/Dockerfile` (Python 3.11 slim).
   - Installs `curl` for container healthcheck execution.
   - Sets `restart: always` for automatic crash recovery.
   - Configures native Docker `HEALTHCHECK`.
2. `frontend`:
   - Multi-stage build in `Dockerfile` (Node 20 build stage $\rightarrow$ Nginx Alpine runtime stage).
   - Serves static assets on port 80/3000.
   - Reverses proxies `/health` and `/api/` directly to `backend:5000`.

---

## 8. Health Monitoring

The Docker healthcheck is declared in `backend/Dockerfile` and `docker-compose.yml`:

```dockerfile
HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=5s \
    CMD curl -f http://localhost:5000/health || exit 1
```

- **Interval (5s):** Container health is verified every 5 seconds.
- **Timeout (3s):** Probe fails if the backend does not respond within 3 seconds.
- **Retries (3):** 3 consecutive probe failures trigger an unhealthy status.
- **Start Period (5s):** Grace period during cold boots before probe failures count against container health.

---

## 9. Automatic Recovery

Automatic container recovery is implemented via Docker's native restart policy:
```yaml
restart: always
```
When a container exits (either from graceful shutdown or uncaught SIGKILL crash), the Docker daemon immediately intervenes, initializes a clean container instance, and monitors `/health` until `200 OK` is observed.

In local development environments without a Docker daemon, an in-process supervisor thread in `backend/chaos_engine.py` mirrors this exact behavior, ensuring deterministic demonstrations and reliable timing measurements.

---

## 10. Chaos Experiments

The platform implements two controlled experiments:

### 1. Container Stop (Graceful Termination)
- **Target:** Application Container (`chaos-app:5000`)
- **Signal:** `SIGTERM`
- **Blast Radius:** Single Container
- **Hypothesis:** Sending a stop signal causes the application to terminate gracefully. The healthcheck probe detects service absence within ~1.1s, Docker triggers container restart, and the application resumes normal operation within ~2.0s.

### 2. Container Kill (Abrupt Crash)
- **Target:** Application Container (`chaos-app:5000`)
- **Signal:** `SIGKILL` (Exit code 137)
- **Blast Radius:** Single Container
- **Hypothesis:** An ungraceful crash halts the process instantly. The health probe registers immediate connection refusal (~0.5s), the auto-restart policy respawns the container, and steady state is restored in ~2.3s.

---

## 11. Metrics

All metrics displayed on the dashboard are calculated dynamically from completed experiments using high-precision hardware timers (`time.perf_counter()`):

- **Experiments Executed ($N$):** Total count of completed chaos trials.
- **Successful Recoveries ($R$):** Count of experiments where the healthcheck probe returned to `200 OK`.
- **Recovery Success Rate:** Computed as $(R / N) \times 100\%$.
- **Average Recovery Time (RT / MTTR):** Arithmetic mean of measured recovery durations:
  $$\text{MTTR} = \frac{1}{N} \sum_{i=1}^N \text{RT}_i$$
- **Mean Time to Detect (MTTD / FDT):** Arithmetic mean of detection intervals:
  $$\text{MTTD} = \frac{1}{N} \sum_{i=1}^N \text{FDT}_i$$
- **Availability:** Calculated uptime ratio based on total elapsed operational time vs measured downtime:
  $$\text{Availability} = \frac{\text{Elapsed Time} - \text{Total Downtime}}{\text{Elapsed Time}} \times 100\%$$

---

## 12. Demo Procedure

Follow this procedure during live presentations:
1. **Initial Baseline:** Open the dashboard. Point out `Application Status: HEALTHY`, `Container Status: RUNNING`, `Health Check: HEALTHY`, and `Recovery System: ENABLED`.
2. **Observe Zero State:** Show that `Experiments Executed` is 0, `Average Recovery Time` is `--`, and the Recent Experiments table is empty.
3. **Trigger Container Stop:** Navigate to Chaos Experiments, select **Container Stop**, and click **Execute Container Stop**.
4. **Observe Failure Transition:** Watch the Resilience Lifecycle Bar transition to **FAILURE DETECTED** and the status pill turn crimson as `GET /health` returns `503`.
5. **Observe Auto-Recovery:** Watch the bar move to **RECOVERING**, then **RECOVERED**, returning to steady state within ~2.0 seconds.
6. **Inspect Metrics:** Highlight the updated recovery time and detection latency in Recent Experiments and the top metrics cards.
7. **Trigger Container Kill:** Select **Container Kill**, click **Execute**, and observe the faster crash detection (~0.5s) followed by full recovery (~2.3s).
8. **Final Telemetry Review:** Show 100.0% recovery rate, updated MTTR, and the complete audit trail.

---

## 13. API Endpoints

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API discovery and welcome payload | `200 OK` |
| `GET` | `/health` | Live health probe (200 healthy / 503 during outage) | `200 OK` / `503 Service Unavailable` |
| `GET` | `/api` | Directory of available routes and version info | `200 OK` |
| `GET` | `/api/status` | Real-time status for app, container, probe, and recovery | `200 OK` |
| `GET` | `/api/metrics` | Real computed resilience metrics (MTTR, MTTD, success rate) | `200 OK` |
| `GET` | `/api/experiments` | Audit log of all completed experiments | `200 OK` |
| `GET` | `/api/experiments/current` | Active experiment execution state and phase | `200 OK` |
| `POST` | `/api/experiments/stop` | Trigger controlled Container Stop experiment (SIGTERM) | `202 Accepted` / `409 Conflict` |
| `POST` | `/api/experiments/kill` | Trigger controlled Container Kill experiment (SIGKILL) | `202 Accepted` / `409 Conflict` |
| `POST` | `/api/experiments/reset` | Reset experiment history and restore metrics to baseline | `200 OK` |

---

## 14. Setup Instructions

### Option A: Local Development (Without Docker)

#### 1. Start the Flask Backend
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
# Backend runs at http://localhost:5000
```

#### 2. Start the React Frontend
```powershell
# In a separate terminal at project root:
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

#### 3. Run Automated Tests
```powershell
# Run backend test suite (10/10 tests passing):
.\backend\.venv\Scripts\python.exe backend/test_api.py

# Run frontend build check:
npm run build
```

---

### Option B: Docker Compose Deployment

#### 1. Launch the Stack
```bash
# Clean start with image build:
docker compose up --build -d
```

#### 2. Verify Containers & Health Status
```bash
docker ps
docker inspect --format='{{json .State.Health}}' netflix-backend-1
```

#### 3. Access Dashboard
- **Web UI:** [http://localhost:3000](http://localhost:3000) (or [http://localhost:80](http://localhost:80))
- **Direct Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **Health Endpoint:** [http://localhost:5000/health](http://localhost:5000/health)

#### 4. Tear Down
```bash
docker compose down -v
```

---

## 15. Limitations

As an educational case study for a college DevOps presentation, the following design boundaries apply:
1. **Target Scope:** Injections target the single application container; multi-region geo-failover and cluster-wide splits are out of scope.
2. **Persistence:** Telemetry and experiment history are held in-memory within the backend lifecycle; a persistent SQL database is omitted to maintain minimal overhead.
3. **External Observability:** Prometheus and Grafana instances are not deployed; metrics are served natively via Flask JSON endpoints.
4. **Authentication:** The dashboard is open for public demonstration; RBAC and authentication are omitted.
5. **Host Dependency for Live Docker:** Automatic Docker container restarts require an active Docker Engine or Docker Desktop daemon on the host. In environments without Docker, the in-process `ChaosEngine` supervisor handles probe simulation and metric calculation with identical timing semantics.

---

## ⏱️ 5-Minute Presentation Demo

Follow this step-by-step checklist during the presentation:

| Step | Action | What to Explain / Show |
| :---: | :--- | :--- |
| **1** | **Start Docker / Stack** | Run `docker compose up -d` (or launch backend and frontend servers). |
| **2** | **Open Dashboard** | Navigate to `http://localhost:3000` (or `http://localhost:5173`). |
| **3** | **Show Healthy System** | Point out `Application Status: HEALTHY`, `Container Status: RUNNING`, `Health Check: HEALTHY`, `Recovery System: ENABLED`, and `Lifecycle: NORMAL`. |
| **4** | **Explain Architecture** | Briefly explain the feedback loop: Frontend $\rightarrow$ Backend API $\rightarrow$ Docker Healthcheck Probe $\rightarrow$ Restart Policy. |
| **5** | **Trigger Container Stop** | Click **View & Execute** on *Container Stop*, review parameters, and click **Execute Container Stop**. |
| **6** | **Show Failure Detection** | Point out the Lifecycle bar switching to **FAILURE DETECTED** and the probe returning `HTTP 503`. |
| **7** | **Show Automatic Recovery** | Point out the Lifecycle bar switching to **RECOVERING** as the container restart policy triggers. |
| **8** | **Show Recovery Time** | Point out the Lifecycle bar reaching **RECOVERED**, returning to **NORMAL**, and the recorded Recovery Time (~2.0s) appearing in the Recent Experiments table. |
| **9** | **Trigger Container Kill** | Click **View & Execute** on *Container Kill* and click **Execute Container Kill** to simulate an abrupt crash. |
| **10**| **Show Recovery Again** | Show the instantaneous detection (~0.5s) and automatic restoration to healthy within ~2.3s. |
| **11**| **Show Final Metrics** | Show the aggregated **100.0% Recovery Success Rate**, **Average Recovery Time**, **Mean Time to Detect**, and the complete audit log. |
