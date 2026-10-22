import { API_BASE_URL } from '../config/apiConfig';
import type {
  SystemStatusData,
  ResilienceMetricsData,
  ExperimentRecord,
  CurrentExperimentData,
} from '../types/chaos';

export interface BackendHealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export interface BackendApiInfoResponse {
  name: string;
  version: string;
  status: string;
  endpoints: string[];
}

export interface BackendSystemStatusResponse {
  application: {
    status: string;
  };
  container: {
    status: string;
  };
  healthCheck: {
    status: string;
  };
  recovery: {
    status: string;
  };
}

export interface BackendMetricsResponse {
  experimentsExecuted: number;
  successfulRecoveries: number;
  recoverySuccessRate: number | null;
  averageRecoveryTime: number | null;
  availability: number | null;
}

export interface BackendExperimentsResponse {
  experiments: Array<{
    id: string;
    experiment?: string;
    failureType?: string;
    detectionTime?: string;
    recoveryTime?: string;
    status?: string;
    executedAt?: string;
    [key: string]: unknown;
  }>;
}

export interface AggregatedTelemetryResult {
  status: SystemStatusData;
  metrics: ResilienceMetricsData;
  history: ExperimentRecord[];
}

export const apiService = {
  /**
   * Fetch real backend health status.
   */
  async getHealth(): Promise<BackendHealthResponse> {
    const res = await fetch(`${API_BASE_URL}/health`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Health probe returned HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch API metadata and discoverable endpoints.
   */
  async getApiInfo(): Promise<BackendApiInfoResponse> {
    const res = await fetch(`${API_BASE_URL}/api`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`API info request returned HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch system status from backend.
   */
  async getStatus(): Promise<BackendSystemStatusResponse> {
    const res = await fetch(`${API_BASE_URL}/api/status`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Status request returned HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch resilience metrics from backend.
   */
  async getMetrics(): Promise<BackendMetricsResponse> {
    const res = await fetch(`${API_BASE_URL}/api/metrics`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Metrics request returned HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch experiment audit log from backend.
   */
  async getExperiments(): Promise<BackendExperimentsResponse> {
    const res = await fetch(`${API_BASE_URL}/api/experiments`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Experiments request returned HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch current experiment execution state.
   */
  async getCurrentExperiment(): Promise<CurrentExperimentData> {
    const res = await fetch(`${API_BASE_URL}/api/experiments/current`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Current experiment request returned HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Trigger a controlled chaos experiment: Container Stop or Container Kill.
   */
  async triggerExperiment(type: 'stop' | 'kill'): Promise<{ message: string; experimentId: string; status: string }> {
    const res = await fetch(`${API_BASE_URL}/api/experiments/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (res.status === 409) {
      const err = await res.json();
      throw new Error(err.error || 'Another experiment is currently running.');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `Failed with status ${res.status}` }));
      throw new Error(err.error || `Trigger failed: HTTP ${res.status}`);
    }

    return res.json();
  },

  /**
   * Reset experiment metrics and history.
   */
  async resetExperiments(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/api/experiments/reset`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Reset failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch all telemetry concurrently and map directly to frontend data structures.
   * If the backend is unavailable, returns truthful error/offline states.
   */
  async fetchAllTelemetry(): Promise<AggregatedTelemetryResult> {
    // Attempt concurrent fetch of real endpoints
    const [healthRes, statusRes, metricsRes, experimentsRes] = await Promise.all([
      this.getHealth(),
      this.getStatus(),
      this.getMetrics(),
      this.getExperiments(),
    ]);

    // Format application status
    const appStatus =
      statusRes.application.status.toUpperCase() === 'HEALTHY'
        ? 'HEALTHY'
        : 'DOWN';

    // Format container status (running, stopped, restarting, not_configured)
    const containerStatus =
      statusRes.container.status.toUpperCase() === 'RUNNING'
        ? 'RUNNING'
        : statusRes.container.status.toUpperCase() === 'STOPPED'
        ? 'STOPPED'
        : statusRes.container.status.toUpperCase() === 'RESTARTING'
        ? 'RESTARTING'
        : statusRes.container.status.toUpperCase() === 'NOT_CONFIGURED'
        ? 'NOT_CONFIGURED'
        : 'STOPPED';

    // Format health check status
    const healthCheck =
      statusRes.healthCheck.status.toUpperCase() === 'HEALTHY' ? 'HEALTHY' : 'UNHEALTHY';

    // Format recovery system status
    const recoverySystem =
      statusRes.recovery.status.toUpperCase() === 'ENABLED'
        ? 'ENABLED'
        : statusRes.recovery.status.toUpperCase() === 'NOT_CONFIGURED'
        ? 'NOT_CONFIGURED'
        : 'DISABLED';

    const systemStatus: SystemStatusData = {
      applicationStatus: appStatus,
      containerStatus: containerStatus,
      healthCheck: healthCheck,
      recoverySystem: recoverySystem,
      clusterNode: 'node-devops-primary',
      uptime: 'Live Backend Connected',
      isBackendConnected: true,
      connectionState: 'connected',
      backendTimestamp: healthRes.timestamp,
      backendService: healthRes.service,
    };

    const metricsData: ResilienceMetricsData = {
      experimentsExecuted: metricsRes.experimentsExecuted ?? 0,
      successfulRecoveries: metricsRes.successfulRecoveries ?? 0,
      recoverySuccessRate:
        metricsRes.recoverySuccessRate !== null
          ? `${metricsRes.recoverySuccessRate}`
          : '--',
      averageRecoveryTime:
        metricsRes.averageRecoveryTime !== null
          ? `${metricsRes.averageRecoveryTime}`
          : '--',
      availabilityPercentage:
        metricsRes.availability !== null ? `${metricsRes.availability}%` : '--',
    };

    const historyData: ExperimentRecord[] = (experimentsRes.experiments || []).map(
      (exp, index) => ({
        id: (exp.id as string) || `exp-${index}`,
        experiment: (exp.experiment as string) || 'Unknown Experiment',
        failureType: (exp.failureType as string) || 'N/A',
        detectionTime: (exp.detectionTime as string) || '--',
        recoveryTime: (exp.recoveryTime as string) || '--',
        status: ((exp.status as string)?.toUpperCase() as 'RECOVERED' | 'FAILED' | 'PENDING') || 'PENDING',
        executedAt: (exp.executedAt as string) || (exp.startedAt as string) || new Date().toISOString(),
      })
    );

    return {
      status: systemStatus,
      metrics: metricsData,
      history: historyData,
    };
  },
};
