"""
Task 5 Presentation Validation Script
Demonstrates and validates the complete ChaosResilience sequence:
1. Clean start (reset metrics & history)
2. Baseline demo (Application=HEALTHY, Container=RUNNING, Health Check=HEALTHY, Recovery=ENABLED)
3. Container Stop demo (SIGTERM, 503 detection, auto-recovery, FDT & RT measurements)
4. Container Kill demo (SIGKILL, 503 detection, auto-recovery, FDT & RT measurements)
5. Telemetry & Metrics validation
6. Audit history log verification
"""

import sys
import time
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app import app, default_engine

def run_task5_validation():
    print("=" * 70)
    print("CHAOSRESILIENCE TASK 5 — FINAL SYSTEM PRESENTATION VALIDATION")
    print("=" * 70)

    client = app.test_client()

    # ---------------------------------------------------------
    # 1. Clean Start
    # ---------------------------------------------------------
    print("\n[PHASE 1: CLEAN START & INITIALIZATION]")
    reset_res = client.post("/api/experiments/reset")
    assert reset_res.status_code == 200
    print("  -> Experiment history and telemetry metrics reset to initial baseline.")

    # ---------------------------------------------------------
    # 2. Baseline Demo Check
    # ---------------------------------------------------------
    print("\n[PHASE 2: BASELINE SYSTEM STATUS DEMO]")
    health_res = client.get("/health")
    assert health_res.status_code == 200
    health_data = health_res.get_json()
    print(f"  GET /health: {health_res.status_code} OK -> status: {health_data['status']}")

    status_res = client.get("/api/status")
    assert status_res.status_code == 200
    status_data = status_res.get_json()
    print(f"  GET /api/status: {status_data}")
    app_st = status_data["application"]["status"].upper()
    cont_st = status_data["container"]["status"].upper()
    health_st = status_data["healthCheck"]["status"].upper()
    rec_st = status_data["recovery"]["status"].upper()
    print(f"    - Application Status : {app_st} (HEALTHY)")
    print(f"    - Container Status   : {cont_st} (RUNNING)")
    print(f"    - Health Check       : {health_st} (HEALTHY)")
    print(f"    - Recovery System    : {rec_st} (ENABLED)")
    assert app_st == "HEALTHY"
    assert cont_st == "RUNNING"
    assert health_st == "HEALTHY"
    assert rec_st == "ENABLED"

    metrics_res = client.get("/api/metrics")
    assert metrics_res.status_code == 200
    metrics_data = metrics_res.get_json()
    print(f"  GET /api/metrics: {metrics_data}")
    assert metrics_data["experimentsExecuted"] == 0
    assert metrics_data["successfulRecoveries"] == 0

    exp_res = client.get("/api/experiments")
    assert exp_res.status_code == 200
    exp_data = exp_res.get_json()
    print(f"  GET /api/experiments: {len(exp_data['experiments'])} recorded experiments (clean state)")
    assert len(exp_data['experiments']) == 0

    # ---------------------------------------------------------
    # 3. Container Stop Demo
    # ---------------------------------------------------------
    print("\n[PHASE 3: CONTAINER STOP EXPERIMENT DEMO]")
    print("  1. System healthy before chaos: Application=HEALTHY, Container=RUNNING")
    print("  2. Injecting Controlled Container Stop (POST /api/experiments/stop)...")
    stop_trigger = client.post("/api/experiments/stop")
    assert stop_trigger.status_code == 202
    stop_payload = stop_trigger.get_json()
    print(f"     Status: 202 Accepted | Exp ID: {stop_payload['experimentId']}")

    observed_stop_503 = False
    observed_stop_recovering = False
    stop_start_time = time.time()

    while time.time() - stop_start_time < 6.0:
        h_res = client.get("/health")
        c_res = client.get("/api/experiments/current")
        curr = c_res.get_json()
        state = curr["state"]

        if h_res.status_code == 503:
            observed_stop_503 = True
        if state == "RECOVERING":
            observed_stop_recovering = True

        print(f"     t+{time.time()-stop_start_time:.2f}s | Probe: {h_res.status_code} | Lifecycle: {state}")

        if state == "RECOVERED" and h_res.status_code == 200:
            print(f"  3. Automatic recovery complete! Health check passed (HTTP 200 OK restored).")
            break
        time.sleep(0.3)

    assert observed_stop_503, "Probe failed to emit 503 during Container Stop!"
    assert observed_stop_recovering, "Container Stop failed to enter RECOVERING phase!"

    # Validate post-stop telemetry
    post_stop_metrics = client.get("/api/metrics").get_json()
    post_stop_history = client.get("/api/experiments").get_json()["experiments"]
    print(f"\n  Container Stop Results:")
    print(f"    - Experiments Executed   : {post_stop_metrics['experimentsExecuted']}")
    print(f"    - Successful Recoveries  : {post_stop_metrics['successfulRecoveries']}")
    print(f"    - Recovery Success Rate  : {post_stop_metrics['recoverySuccessRate']}%")
    print(f"    - Detection Time (FDT)   : {post_stop_history[0]['detectionTime']}")
    print(f"    - Recovery Time (RT)     : {post_stop_history[0]['recoveryTime']}")
    print(f"    - Audit Log Status       : {post_stop_history[0]['status']}")
    assert post_stop_metrics["experimentsExecuted"] == 1
    assert post_stop_metrics["successfulRecoveries"] == 1
    assert post_stop_history[0]["status"] == "RECOVERED"

    # ---------------------------------------------------------
    # 4. Container Kill Demo
    # ---------------------------------------------------------
    print("\n[PHASE 4: CONTAINER KILL EXPERIMENT DEMO]")
    print("  1. System healthy before chaos: Application=HEALTHY, Container=RUNNING")
    print("  2. Injecting Controlled Container Kill / Crash (POST /api/experiments/kill)...")
    kill_trigger = client.post("/api/experiments/kill")
    assert kill_trigger.status_code == 202
    kill_payload = kill_trigger.get_json()
    print(f"     Status: 202 Accepted | Exp ID: {kill_payload['experimentId']}")

    observed_kill_503 = False
    observed_kill_recovering = False
    kill_start_time = time.time()

    while time.time() - kill_start_time < 6.0:
        h_res = client.get("/health")
        c_res = client.get("/api/experiments/current")
        curr = c_res.get_json()
        state = curr["state"]

        if h_res.status_code == 503:
            observed_kill_503 = True
        if state == "RECOVERING":
            observed_kill_recovering = True

        print(f"     t+{time.time()-kill_start_time:.2f}s | Probe: {h_res.status_code} | Lifecycle: {state}")

        if state == "RECOVERED" and h_res.status_code == 200:
            print(f"  3. Automatic recovery complete! Health check passed (HTTP 200 OK restored).")
            break
        time.sleep(0.3)

    assert observed_kill_503, "Probe failed to emit 503 during Container Kill!"
    assert observed_kill_recovering, "Container Kill failed to enter RECOVERING phase!"

    # ---------------------------------------------------------
    # 5. Final Metrics & Audit History Validation
    # ---------------------------------------------------------
    print("\n[PHASE 5: FINAL METRICS & AUDIT VERIFICATION]")
    final_metrics = client.get("/api/metrics").get_json()
    final_history = client.get("/api/experiments").get_json()["experiments"]

    print("  Aggregated Telemetry Metrics:")
    print(f"    - Experiments Executed   : {final_metrics['experimentsExecuted']}")
    print(f"    - Successful Recoveries  : {final_metrics['successfulRecoveries']}")
    print(f"    - Recovery Success Rate  : {final_metrics['recoverySuccessRate']}%")
    print(f"    - Average Recovery Time  : {final_metrics['averageRecoveryTime']}s")
    print(f"    - Mean Time To Detect    : {final_metrics['meanTimeToDetect']}s")
    print(f"    - System Availability    : {final_metrics['availability']}%")

    assert final_metrics["experimentsExecuted"] == 2
    assert final_metrics["successfulRecoveries"] == 2
    assert final_metrics["recoverySuccessRate"] == 100.0
    assert final_metrics["averageRecoveryTime"] > 0
    assert final_metrics["meanTimeToDetect"] > 0

    print(f"\n  Final Audit History ({len(final_history)} entries):")
    for i, exp in enumerate(final_history, 1):
        print(f"    {i}. [{exp['id']}] {exp['experiment']} ({exp['failureType']})")
        print(f"       Detection Time : {exp['detectionTime']}")
        print(f"       Recovery Time  : {exp['recoveryTime']}")
        print(f"       Outcome        : {exp['status']}")
        print(f"       Timestamp      : {exp['executedAt']}")

    print("\n" + "=" * 70)
    print("ALL PRESENTATION DEMO PHASES VALIDATED AND READY FOR DEMO!")
    print("=" * 70)

if __name__ == "__main__":
    run_task5_validation()
