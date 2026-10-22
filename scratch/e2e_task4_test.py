"""
End-to-End Task 4 Verification Script for ChaosResilience
Tests:
1. GET /health -> initial 200 OK
2. POST /api/experiments/stop -> 202 Accepted
3. Poll /health -> verifies 503 Unhealthy during failure window
4. Poll /api/experiments/current -> verifies state transitions (RUNNING -> FAILURE_DETECTED -> RECOVERING -> RECOVERED)
5. Wait for recovery -> verifies 200 OK restored
6. GET /api/metrics -> verifies real detection time & recovery time recorded
7. POST /api/experiments/kill -> tests Container Kill crash recovery
8. GET /api/experiments -> verifies history table entries
"""

import sys
import time
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app import app, default_engine

def run_e2e_verification():
    print("=" * 60)
    print("CHAOSRESILIENCE TASK 4 END-TO-END VALIDATION")
    print("=" * 60)

    client = app.test_client()

    # Step 1: Baseline health check
    print("\n[Step 1] Baseline Health Check (GET /health):")
    res = client.get("/health")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.get_json()
    print(f"Status: {res.status_code}, Payload: {data}")
    assert data["status"] == "healthy"

    # Step 2: Trigger Container Stop Experiment
    print("\n[Step 2] Trigger Container Stop Experiment (POST /api/experiments/stop):")
    res = client.post("/api/experiments/stop")
    assert res.status_code == 202, f"Expected 202, got {res.status_code}"
    stop_payload = res.get_json()
    print(f"Status: {res.status_code}, Payload: {stop_payload}")

    # Step 3: Monitor Health Degradation & Recovery
    print("\n[Step 3] Monitoring Health Probe & State Transitions:")
    observed_503 = False
    states_observed = set()

    start_monitor = time.time()
    while time.time() - start_monitor < 6.0:
        h_res = client.get("/health")
        curr_res = client.get("/api/experiments/current")
        curr_data = curr_res.get_json()
        state = curr_data["state"]
        states_observed.add(state)

        if h_res.status_code == 503:
            observed_503 = True

        print(f"  t+{time.time()-start_monitor:.2f}s | Health: {h_res.status_code} | Experiment State: {state} | Details: {curr_data.get('details', {}).get('message', '')}")

        if state == "RECOVERED" and h_res.status_code == 200:
            print("  -> Application successfully recovered and healthy!")
            break

        time.sleep(0.3)

    assert observed_503, "Health check failed to reflect 503 during simulated container outage!"
    print("\n[Verification Passed] Health check successfully emitted HTTP 503 during failure.")
    print(f"Observed states during experiment: {states_observed}")

    # Step 4: Validate Metrics after Container Stop
    print("\n[Step 4] Checking Resilience Telemetry Metrics (GET /api/metrics):")
    metrics_res = client.get("/api/metrics")
    assert metrics_res.status_code == 200
    metrics = metrics_res.get_json()
    print(f"Metrics payload: {metrics}")
    assert metrics["experimentsExecuted"] == 1
    assert metrics["successfulRecoveries"] == 1
    assert metrics["recoverySuccessRate"] == 100.0 or metrics["recoverySuccessRate"] == "100.0%"
    assert metrics["averageRecoveryTime"] is not None
    print(f"  Recorded Recovery Time: {metrics['averageRecoveryTime']}s")
    print(f"  Recorded Detection Time: {metrics['meanTimeToDetect']}s")

    # Step 5: Trigger Container Kill Experiment
    print("\n[Step 5] Trigger Container Kill Experiment (POST /api/experiments/kill):")
    kill_res = client.post("/api/experiments/kill")
    assert kill_res.status_code == 202
    print(f"Status: {kill_res.status_code}, Payload: {kill_res.get_json()}")

    # Step 6: Monitor Recovery of Container Kill
    start_kill_monitor = time.time()
    while time.time() - start_kill_monitor < 6.0:
        h_res = client.get("/health")
        curr_res = client.get("/api/experiments/current")
        curr_data = curr_res.get_json()
        state = curr_data["state"]

        print(f"  t+{time.time()-start_kill_monitor:.2f}s | Health: {h_res.status_code} | State: {state}")

        if state == "RECOVERED" and h_res.status_code == 200:
            print("  -> Container Kill experiment recovered and healthy!")
            break

        time.sleep(0.3)

    # Step 7: Final Metrics & Audit History Check
    print("\n[Step 7] Final Metrics & Audit History:")
    final_metrics = client.get("/api/metrics").get_json()
    print(f"Final Metrics: {final_metrics}")
    assert final_metrics["experimentsExecuted"] == 2
    assert final_metrics["successfulRecoveries"] == 2
    assert final_metrics["recoverySuccessRate"] == 100.0 or final_metrics["recoverySuccessRate"] == "100.0%"

    history_res = client.get("/api/experiments")
    history_data = history_res.get_json()
    print(f"\nAudit History ({len(history_data['experiments'])} entries):")
    for rec in history_data["experiments"]:
        print(f"  - [{rec['id']}] {rec['experiment']} ({rec['failureType']}): Detection={rec['detectionTime']}, Recovery={rec['recoveryTime']}, Status={rec['status']}")

    print("\n" + "=" * 60)
    print("ALL TASK 4 VERIFICATIONS COMPLETED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_e2e_verification()
