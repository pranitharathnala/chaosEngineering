import type { SystemStatusData, ResilienceMetricsData, ChaosExperimentConfig, ExperimentRecord } from '../types/chaos';

/**
 * INITIAL FRONTEND UI STATES
 * 
 * Used for initial loading states before live backend telemetry arrives,
 * and fallback states if the backend is unreachable.
 */

export const INITIAL_SYSTEM_STATUS: SystemStatusData = {
  applicationStatus: 'CONNECTING',
  containerStatus: 'NOT_CONFIGURED',
  healthCheck: 'PENDING',
  recoverySystem: 'NOT_CONFIGURED',
  clusterNode: 'node-devops-primary',
  uptime: 'Connecting to resilience backend...',
  isBackendConnected: false,
  connectionState: 'loading',
};

export const BACKEND_UNAVAILABLE_STATUS: SystemStatusData = {
  applicationStatus: 'UNAVAILABLE',
  containerStatus: 'NOT_CONFIGURED',
  healthCheck: 'UNAVAILABLE',
  recoverySystem: 'NOT_CONFIGURED',
  clusterNode: 'node-devops-primary',
  uptime: 'Backend Disconnected',
  isBackendConnected: false,
  connectionState: 'error',
  errorMessage: 'Backend unavailable. Ensure the Flask API is running on port 5000.',
};

export const INITIAL_METRICS: ResilienceMetricsData = {
  experimentsExecuted: 0,
  successfulRecoveries: 0,
  recoverySuccessRate: '--',
  averageRecoveryTime: '--',
  availabilityPercentage: '--',
  meanTimeToDetect: '--',
};

export const CHAOS_EXPERIMENTS: ChaosExperimentConfig[] = [
  {
    id: 'exp-container-stop',
    name: 'Container Stop',
    tagline: 'Graceful Termination Test',
    description: 'Sends SIGTERM to the primary container instance to test clean shutdown handling, traffic draining, and automated container restart by the supervisor.',
    riskLevel: 'LOW',
    status: 'READY',
    targetComponent: 'app-service:8080 (Primary Node)',
    blastRadius: 'Single Container Instance',
    hypothesis: 'Application supervisor detects stopped container within 3s and initiates automated restart with zero persistent data loss.',
    commandPreview: 'docker stop chaos-target-app',
    expectedRecovery: 'Docker restart policy triggers automatically; Health check verifies /health within 5s.',
    tags: ['Docker', 'Graceful Shutdown', 'Failover']
  },
  {
    id: 'exp-container-kill',
    name: 'Container Kill',
    tagline: 'Sudden Unscheduled Crash',
    description: 'Issues an immediate SIGKILL to simulate unexpected hardware failure, kernel out-of-memory (OOM) termination, or hard container crash without prior notification.',
    riskLevel: 'HIGH',
    status: 'READY',
    targetComponent: 'app-service (PID 1)',
    blastRadius: 'Container Process Level',
    hypothesis: 'System detects dead process socket, health monitor flags unhealthy within 2s, and self-healing subsystem provisions replacement container.',
    commandPreview: 'docker kill chaos-target-app',
    expectedRecovery: 'Crash detector reports failure; Automated recovery script boots fresh container within 4s.',
    tags: ['SIGKILL', 'OOM Crash', 'Self-Healing']
  },
  {
    id: 'exp-service-failure',
    name: 'Service Failure',
    tagline: 'Internal HTTP 500 Fault Injection',
    description: 'Simulates application-level internal server faults, dependency timeouts, or corrupted state returning consecutive HTTP 500 internal errors to caller requests.',
    riskLevel: 'MEDIUM',
    status: 'READY',
    targetComponent: 'REST Endpoint /api/process',
    blastRadius: 'Application Routing Tier',
    hypothesis: 'Health check probe catches 3 consecutive HTTP 500 responses, shifts traffic to recovery mode, and triggers automated application reload.',
    commandPreview: 'curl -X POST http://localhost:8080/chaos/inject-fault',
    expectedRecovery: 'Circuit breaker trips; automated rollback or health restorer recycles application worker.',
    tags: ['HTTP 500', 'Circuit Breaker', 'Telemetry']
  }
];

export const INITIAL_EXPERIMENT_HISTORY: ExperimentRecord[] = [];
