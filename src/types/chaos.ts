/**
 * Type definitions for ChaosResilience DevOps Platform
 * Directly aligned with backend API contracts:
 * - GET /health
 * - GET /api/status
 * - GET /api/metrics
 * - GET /api/experiments
 * - GET /api/experiments/current
 * - POST /api/experiments/stop
 * - POST /api/experiments/kill
 */

export type StatusLevel =
  | 'HEALTHY'
  | 'RUNNING'
  | 'ENABLED'
  | 'DEGRADED'
  | 'UNHEALTHY'
  | 'STOPPED'
  | 'DISABLED'
  | 'IDLE'
  | 'READY'
  | 'NOT_CONFIGURED'
  | 'CONNECTING'
  | 'UNAVAILABLE';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type ConnectionState = 'loading' | 'connected' | 'error';

export type ExperimentState =
  | 'IDLE'
  | 'RUNNING'
  | 'FAILURE_DETECTED'
  | 'RECOVERING'
  | 'RECOVERED'
  | 'FAILED';

export interface CurrentExperimentDetails {
  id: string;
  experiment: string;
  failureType: string;
  type: 'stop' | 'kill';
  status: string;
  startedAt: string;
  failureDetectedAt?: string | null;
  recoveryStartedAt?: string | null;
  recoveredAt?: string | null;
  detectionTime?: string | null;
  recoveryTime?: string | null;
  message?: string;
}

export interface CurrentExperimentData {
  state: ExperimentState;
  active?: boolean;
  experiment: string | null;
  name?: string | null;
  experimentId: string | null;
  target?: string;
  elapsedSeconds?: number;
  lastResult?: {
    name: string;
    recoveryTimeSeconds: number;
    failureDetectionTimeSeconds: number;
    status: string;
  } | null;
  details?: CurrentExperimentDetails | null;
}

export interface SystemStatusData {
  applicationStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'CONNECTING' | 'UNAVAILABLE';
  containerStatus: 'RUNNING' | 'STOPPED' | 'RESTARTING' | 'NOT_CONFIGURED';
  healthCheck: 'HEALTHY' | 'UNHEALTHY' | 'PENDING' | 'UNAVAILABLE';
  recoverySystem: 'ENABLED' | 'DISABLED' | 'TRIGGERED' | 'NOT_CONFIGURED';
  clusterNode?: string;
  uptime?: string;
  isBackendConnected: boolean;
  connectionState: ConnectionState;
  backendTimestamp?: string;
  backendService?: string;
  errorMessage?: string;
}

export interface ResilienceMetricsData {
  experimentsExecuted: number;
  successfulRecoveries: number;
  recoverySuccessRate: string; // Formatted percentage or '--'
  averageRecoveryTime: string; // Formatted seconds or '--'
  availabilityPercentage?: string; // Formatted percentage or '--'
  meanTimeToDetect?: string;
}

export interface ChaosExperimentConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  riskLevel: RiskLevel;
  status: 'IDLE' | 'READY' | 'QUEUED';
  commandPreview: string;
  targetComponent: string;
  blastRadius: string;
  hypothesis: string;
  expectedRecovery: string;
  tags: string[];
}

export interface ExperimentRecord {
  id: string;
  experiment: string;
  failureType: string;
  detectionTime: string;
  recoveryTime: string;
  status: 'RECOVERED' | 'FAILED' | 'PENDING';
  executedAt: string;
}
