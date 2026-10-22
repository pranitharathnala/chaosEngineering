# ChaosResilience — Backend Service (Task 4 Complete)

The backend service and resilience control plane for **ChaosResilience**, an educational DevOps Chaos Engineering proof-of-concept inspired by Netflix's resilience engineering principles.

> **Status:** TASK 4 COMPLETE — Health Monitoring, Automatic Recovery, Chaos Experiments, and Real Telemetry are fully implemented and verified with automated test suites.

---

## 1. Backend Architecture & Chaos Engine

The backend serves as both the application payload and the resilience supervisor:
- **Application Payload:** Serves REST APIs and health status on port 5000.
- **Chaos Engine (`chaos_engine.py`):** Thread-safe controller managing controlled failure injection, health probe degradation (HTTP 503), simulated container restart, recovery verification, and real metric computation.
- **Docker Healthcheck Integration:** Provides a real, probeable `GET /health` endpoint configured in `Dockerfile` and `docker-compose.yml` (`HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=5s`).
- **Automatic Recovery:** Utilizes Docker `restart: always` policy and an in-process supervisor thread that restores service health after simulated crashes or stops.
- **High-Precision Timing:** Uses Python hardware timers (`time.perf_counter()`) to compute exact wall-clock Failure Detection Time (FDT) and Recovery Time (RT).

---

## 2. Resilience Loop Lifecycle

```
[IDLE / HEALTHY] (GET /health -> 200 OK)
       │
       │  POST /api/experiments/stop OR /kill
       ▼
  [RUNNING] ── Container stopped / killed (is_healthy = False)
       │
       ▼
[FAILURE_DETECTED] (GET /health -> 503 Service Unavailable)
       │
       ▼
 [RECOVERING] ── Docker restart policy triggered
       │
       ▼
 [RECOVERED] ── Application booted, GET /health -> 200 OK restored
       │
       ▼
 [METRICS UPDATED] ── FDT & RT computed, audit log entry created
```

---

## 3. Requirements

- **Python:** 3.10+ (Tested on Python 3.14)
- **Pip:** 23.0+
- **Core Packages:**
  - `Flask>=3.0.0`
  - `Flask-Cors>=4.0.0`

---

## 4. Local Development & Virtual Environment

From the project root:

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment named .venv
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies
.\.venv\Scripts\pip install -r requirements.txt

# Run backend API
.\.venv\Scripts\python app.py
```

The server listens on `http://0.0.0.0:5000` (accessible at `http://localhost:5000`).

---

## 5. API Endpoints Reference

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API discovery and documentation links | `200 OK` |
| `GET` | `/health` | Healthcheck probe (healthy or 503 during outage) | `200 OK` / `503 Service Unavailable` |
| `GET` | `/api` | API directory of available routes | `200 OK` |
| `GET` | `/api/status` | Complete system, container, probe & recovery status | `200 OK` |
| `GET` | `/api/metrics` | Real computed resilience metrics (MTTR, MTTD, success rate) | `200 OK` |
| `GET` | `/api/experiments` | Audit log of all executed experiments | `200 OK` |
| `GET` | `/api/experiments/current` | Active experiment execution state & progress | `200 OK` |
| `POST` | `/api/experiments/stop` | Trigger controlled Container Stop experiment (SIGTERM) | `202 Accepted` / `409 Conflict` |
| `POST` | `/api/experiments/kill` | Trigger controlled Container Kill experiment (SIGKILL) | `202 Accepted` / `409 Conflict` |
| `POST` | `/api/experiments/reset` | Reset experiment history and restore metrics to baseline | `200 OK` |

---

## 6. Example API Payloads

### `GET /health` (Healthy)
```json
{
  "status": "healthy",
  "service": "ChaosResilience",
  "container": "running",
  "timestamp": "2026-10-04T06:23:50.514137+00:00"
}
```

### `GET /health` (During Failure Injection)
```json
{
  "status": "unhealthy",
  "service": "ChaosResilience",
  "container": "stopped",
  "error": "Application degraded or container terminated by chaos experiment",
  "timestamp": "2026-10-04T06:23:51.120000+00:00"
}
```

### `POST /api/experiments/stop`
```json
{
  "status": "RUNNING",
  "experimentId": "exp-1791095030",
  "message": "Container Stop experiment started",
  "target": "chaos-app:5000",
  "startedAt": "2026-10-04T06:23:50.514822+00:00"
}
```

### `GET /api/metrics` (After Experiment Recovery)
```json
{
  "experimentsExecuted": 2,
  "successfulRecoveries": 2,
  "recoverySuccessRate": 100.0,
  "averageRecoveryTime": 2.15,
  "meanTimeToDetect": 0.8,
  "availability": 95.0
}
```

---

## 7. Running Backend Unit Tests

Run the automated test suite from the project root:

```powershell
.\backend\.venv\Scripts\python.exe backend/test_api.py
```

### Test Coverage (10/10 Tests Passing):
1. `test_health_endpoint_healthy` — Verifies baseline 200 OK response.
2. `test_system_status_endpoint` — Verifies full status payload.
3. `test_metrics_endpoint_initial` — Verifies baseline metric initial values.
4. `test_experiments_endpoint_initial` — Verifies empty audit list initially.
5. `test_404_json_handler` — Ensures pure JSON responses on missing routes.
6. `test_405_json_handler` — Ensures pure JSON responses on invalid methods.
7. `test_container_stop_experiment_lifecycle` — Tests complete Stop injection, 503 health failure, automatic recovery, and metrics recording.
8. `test_container_kill_experiment_lifecycle` — Tests complete Kill crash injection, 503 failure window, automatic recovery, and metrics recording.
9. `test_experiment_conflict_409` — Ensures concurrent experiment prevention with HTTP 409 Conflict.
10. `test_experiments_reset_endpoint` — Tests resetting execution history.
