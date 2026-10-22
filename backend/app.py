import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from chaos_engine import ChaosEngine

def create_app(engine: ChaosEngine = None) -> Flask:
    """Application factory for the ChaosResilience Backend API."""
    app = Flask(__name__)
    
    # Shared or injected ChaosEngine instance
    chaos_engine = engine or ChaosEngine()

    # Configure CORS for local development with React frontend
    CORS(
        app,
        resources={
            r"/*": {
                "origins": [
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                    "http://localhost:3000",
                    "http://127.0.0.1:3000",
                ],
                "methods": ["GET", "POST", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
            }
        },
    )

    # --------------------------------------------------------------------------
    # Root Endpoint
    # --------------------------------------------------------------------------
    @app.route("/", methods=["GET"])
    def root():
        """Root endpoint directing clients to API index and health check."""
        return (
            jsonify(
                {
                    "name": "ChaosResilience API",
                    "service": "ChaosResilience",
                    "version": "1.0",
                    "status": "running",
                    "documentation": "/api",
                    "health": "/health",
                }
            ),
            200,
        )

    # --------------------------------------------------------------------------
    # API 1 — HEALTH (Used by Docker HEALTHCHECK)
    # --------------------------------------------------------------------------
    @app.route("/health", methods=["GET"])
    def health():
        """
        Real backend health response.
        Returns 200 OK during normal operation, 503 during active chaos failure injection.
        Directly tested by Docker HEALTHCHECK.
        """
        payload, code = chaos_engine.get_health()
        return jsonify(payload), code

    # --------------------------------------------------------------------------
    # API 5 — API INFORMATION
    # --------------------------------------------------------------------------
    @app.route("/api", methods=["GET"])
    def api_info():
        """Returns API metadata and list of available endpoints."""
        return (
            jsonify(
                {
                    "name": "ChaosResilience API",
                    "version": "1.0",
                    "status": "running",
                    "endpoints": [
                        "/health",
                        "/api/status",
                        "/api/metrics",
                        "/api/experiments",
                        "/api/experiments/current",
                        "/api/experiments/stop",
                        "/api/experiments/kill",
                    ],
                }
            ),
            200,
        )

    # --------------------------------------------------------------------------
    # API 2 — SYSTEM STATUS
    # --------------------------------------------------------------------------
    @app.route("/api/status", methods=["GET"])
    def system_status():
        """
        System status endpoint.
        Returns real-time health of application, container, health probe, and recovery.
        """
        return jsonify(chaos_engine.get_status()), 200

    # --------------------------------------------------------------------------
    # API 3 — METRICS
    # --------------------------------------------------------------------------
    @app.route("/api/metrics", methods=["GET"])
    def metrics():
        """
        Resilience metrics endpoint.
        Returns real quantitative measurements (executions, recoveries, MTTR, availability).
        """
        return jsonify(chaos_engine.get_metrics()), 200

    # --------------------------------------------------------------------------
    # API 4 — EXPERIMENT HISTORY
    # --------------------------------------------------------------------------
    @app.route("/api/experiments", methods=["GET"])
    def experiments():
        """Returns historical log of executed chaos experiments."""
        return jsonify(chaos_engine.get_experiments()), 200

    # --------------------------------------------------------------------------
    # API 6 — CURRENT EXPERIMENT STATUS
    # --------------------------------------------------------------------------
    @app.route("/api/experiments/current", methods=["GET"])
    def current_experiment():
        """Returns the status and stage of the active or most recent experiment."""
        return jsonify(chaos_engine.get_current_experiment()), 200

    # --------------------------------------------------------------------------
    # API 7 — CHAOS EXPERIMENT CONTROLLER: STOP
    # --------------------------------------------------------------------------
    @app.route("/api/experiments/stop", methods=["POST"])
    def experiment_stop():
        """
        Triggers controlled Container Stop experiment (SIGTERM graceful halt).
        Safe endpoint: strictly allowlisted, no arbitrary commands accepted.
        """
        try:
            result = chaos_engine.trigger_experiment("stop")
            return jsonify(result), 202
        except RuntimeError as e:
            return jsonify({"error": str(e)}), 409
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

    # --------------------------------------------------------------------------
    # API 8 — CHAOS EXPERIMENT CONTROLLER: KILL
    # --------------------------------------------------------------------------
    @app.route("/api/experiments/kill", methods=["POST"])
    def experiment_kill():
        """
        Triggers controlled Container Kill experiment (SIGKILL sudden crash).
        Safe endpoint: strictly allowlisted, no arbitrary commands accepted.
        """
        try:
            result = chaos_engine.trigger_experiment("kill")
            return jsonify(result), 202
        except RuntimeError as e:
            return jsonify({"error": str(e)}), 409
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

    # --------------------------------------------------------------------------
    # API 9 — EXPERIMENT RESET (Demo helper)
    # --------------------------------------------------------------------------
    @app.route("/api/experiments/reset", methods=["POST"])
    def experiment_reset():
        """Resets all metrics and history back to clean state."""
        chaos_engine.reset()
        return jsonify({"message": "Telemetry and experiment history reset successfully"}), 200

    # --------------------------------------------------------------------------
    # ERROR HANDLERS (JSON ONLY, NO HTML)
    # --------------------------------------------------------------------------
    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(405)
    def handle_method_not_allowed(error):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(500)
    def handle_internal_server_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app

default_engine = ChaosEngine()
app = create_app(default_engine)

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 5000))
    app.run(host=host, port=port, debug=False)
