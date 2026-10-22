import React from 'react';
import { Server, Box, HeartPulse, RefreshCw, AlertCircle, RotateCw, Activity, ShieldCheck } from 'lucide-react';
import type { SystemStatusData, CurrentExperimentData } from '../types/chaos';

interface SystemStatusProps {
  status: SystemStatusData;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  currentExperiment?: CurrentExperimentData | null;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  status,
  onRefresh,
  isRefreshing = false,
  currentExperiment,
}) => {
  const getAppStatusDisplay = () => {
    switch (status.applicationStatus) {
      case 'HEALTHY':
        return { text: 'HEALTHY', dotClass: 'healthy', badgeClass: 'healthy' };
      case 'DEGRADED':
        return { text: 'DEGRADED', dotClass: 'danger', badgeClass: 'danger' };
      case 'CONNECTING':
        return { text: 'CONNECTING', dotClass: 'loading', badgeClass: 'loading' };
      case 'DOWN':
        return { text: 'DOWN', dotClass: 'danger', badgeClass: 'danger' };
      case 'UNAVAILABLE':
        return { text: 'UNAVAILABLE', dotClass: 'danger', badgeClass: 'danger' };
      default:
        return { text: status.applicationStatus, dotClass: 'warning', badgeClass: 'warning' };
    }
  };

  const getContainerStatusDisplay = () => {
    switch (status.containerStatus) {
      case 'RUNNING':
        return { text: 'RUNNING', dotClass: 'healthy', badgeClass: 'healthy' };
      case 'STOPPED':
        return { text: 'STOPPED', dotClass: 'danger', badgeClass: 'danger' };
      case 'RESTARTING':
        return { text: 'RESTARTING', dotClass: 'warning', badgeClass: 'warning' };
      case 'NOT_CONFIGURED':
        return { text: 'NOT CONFIGURED', dotClass: 'neutral', badgeClass: 'neutral' };
      default:
        return { text: status.containerStatus, dotClass: 'warning', badgeClass: 'warning' };
    }
  };

  const getHealthCheckDisplay = () => {
    switch (status.healthCheck) {
      case 'HEALTHY':
        return { text: 'HEALTHY', dotClass: 'healthy', badgeClass: 'healthy' };
      case 'PENDING':
        return { text: 'PENDING', dotClass: 'loading', badgeClass: 'loading' };
      case 'UNHEALTHY':
        return { text: 'UNHEALTHY', dotClass: 'danger', badgeClass: 'danger' };
      case 'UNAVAILABLE':
        return { text: 'UNAVAILABLE', dotClass: 'danger', badgeClass: 'danger' };
      default:
        return { text: status.healthCheck, dotClass: 'warning', badgeClass: 'warning' };
    }
  };

  const getRecoveryDisplay = () => {
    switch (status.recoverySystem) {
      case 'ENABLED':
        return { text: 'ENABLED', dotClass: 'healthy', badgeClass: 'healthy' };
      case 'TRIGGERED':
        return { text: 'TRIGGERED', dotClass: 'warning', badgeClass: 'warning' };
      case 'DISABLED':
        return { text: 'DISABLED', dotClass: 'danger', badgeClass: 'danger' };
      case 'NOT_CONFIGURED':
        return { text: 'NOT CONFIGURED', dotClass: 'neutral', badgeClass: 'neutral' };
      default:
        return { text: status.recoverySystem, dotClass: 'warning', badgeClass: 'warning' };
    }
  };

  const getLifecycleState = (): 'NORMAL' | 'FAILURE DETECTED' | 'RECOVERING' | 'RECOVERED' => {
    if (currentExperiment?.state === 'FAILURE_DETECTED') return 'FAILURE DETECTED';
    if (currentExperiment?.state === 'RECOVERING') return 'RECOVERING';
    if (currentExperiment?.state === 'RECOVERED') return 'RECOVERED';
    if (currentExperiment?.state === 'RUNNING') return 'FAILURE DETECTED';
    if (status.applicationStatus === 'DEGRADED' || status.healthCheck === 'UNHEALTHY') {
      return 'FAILURE DETECTED';
    }
    return 'NORMAL';
  };

  const lifecycleState = getLifecycleState();
  const appDisplay = getAppStatusDisplay();
  const containerDisplay = getContainerStatusDisplay();
  const healthDisplay = getHealthCheckDisplay();
  const recoveryDisplay = getRecoveryDisplay();

  const statusItems = [
    {
      id: 'app-status',
      title: 'Application Status',
      value: appDisplay.text,
      dotClass: appDisplay.dotClass,
      badgeClass: appDisplay.badgeClass,
      icon: Server,
      accent: appDisplay.badgeClass === 'healthy' ? 'emerald' : appDisplay.badgeClass === 'danger' ? 'red' : 'cyan',
      description: 'Primary web application response health',
      endpoint: 'GET /api/status'
    },
    {
      id: 'container-status',
      title: 'Container Status',
      value: containerDisplay.text,
      dotClass: containerDisplay.dotClass,
      badgeClass: containerDisplay.badgeClass,
      icon: Box,
      accent: containerDisplay.badgeClass === 'healthy' ? 'emerald' : containerDisplay.badgeClass === 'danger' ? 'red' : 'neutral',
      description: 'Docker container lifecycle & runtime state',
      endpoint: 'GET /api/status'
    },
    {
      id: 'health-check',
      title: 'Health Check',
      value: healthDisplay.text,
      dotClass: healthDisplay.dotClass,
      badgeClass: healthDisplay.badgeClass,
      icon: HeartPulse,
      accent: healthDisplay.badgeClass === 'healthy' ? 'emerald' : healthDisplay.badgeClass === 'danger' ? 'red' : 'cyan',
      description: 'Automated liveness & readiness probe',
      endpoint: 'GET /health'
    },
    {
      id: 'recovery-system',
      title: 'Recovery System',
      value: recoveryDisplay.text,
      dotClass: recoveryDisplay.dotClass,
      badgeClass: recoveryDisplay.badgeClass,
      icon: RefreshCw,
      accent: recoveryDisplay.badgeClass === 'healthy' ? 'cyan' : recoveryDisplay.badgeClass === 'warning' ? 'amber' : 'neutral',
      description: 'Docker auto-restart watchdog supervisor',
      endpoint: 'GET /api/status'
    },
  ];

  return (
    <section id="system-status" className="section system-status-section" aria-labelledby="status-title">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <HeartPulse size={14} />
            <span>Telemetry & Health</span>
          </div>
          <h2 id="status-title" className="section-title">Live System Status</h2>
          <p className="section-subtitle">
            Real-time observability of target microservices, container health checks, and self-healing subsystems.
          </p>
        </div>

        {/* Resilience State Tracker (4-Phase Demo Bar) */}
        <div className="resilience-lifecycle-bar glass-card">
          <div className="lifecycle-header">
            <div className="lifecycle-title-group">
              <Activity size={18} className="lifecycle-icon" />
              <span className="lifecycle-heading">Resilience Lifecycle State:</span>
            </div>
            <div className={`lifecycle-current-badge ${lifecycleState.toLowerCase().replace(' ', '-')}`}>
              <span className="lifecycle-pulse-dot" />
              <span className="lifecycle-badge-text">{lifecycleState}</span>
            </div>
          </div>
          <div className="lifecycle-track">
            <div className={`lifecycle-step ${lifecycleState === 'NORMAL' ? 'active-step' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">NORMAL</span>
            </div>
            <div className="lifecycle-connector" />
            <div className={`lifecycle-step ${lifecycleState === 'FAILURE DETECTED' ? 'active-step alert-step' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">FAILURE DETECTED</span>
            </div>
            <div className="lifecycle-connector" />
            <div className={`lifecycle-step ${lifecycleState === 'RECOVERING' ? 'active-step warn-step' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">RECOVERING</span>
            </div>
            <div className="lifecycle-connector" />
            <div className={`lifecycle-step ${lifecycleState === 'RECOVERED' ? 'active-step success-step' : ''}`}>
              <span className="step-number">4</span>
              <span className="step-label">RECOVERED</span>
            </div>
          </div>
        </div>

        {/* Dynamic Connection & Telemetry Banner */}
        <div className={`status-disclaimer-banner ${status.connectionState}`}>
          <div className="disclaimer-icon">
            {status.connectionState === 'loading' && <RotateCw size={18} className="spin-icon" />}
            {status.connectionState === 'error' && <AlertCircle size={18} />}
            {status.connectionState === 'connected' && <ShieldCheck size={18} />}
          </div>
          <div className="disclaimer-content">
            {status.connectionState === 'loading' && (
              <>
                <span className="disclaimer-title">Connecting to resilience backend...</span>
                <p className="disclaimer-text">
                  Establishing communication with the Flask telemetry server (polling <code>/health</code> and <code>/api/status</code>).
                </p>
              </>
            )}
            {status.connectionState === 'error' && (
              <>
                <span className="disclaimer-title">Backend unavailable:</span>
                <p className="disclaimer-text">
                  The Flask backend API is unreachable. Real backend status cannot be verified. Please start the backend service on port 5000.
                </p>
              </>
            )}
            {status.connectionState === 'connected' && (
              <>
                <span className="disclaimer-title">Live Resilience Control Plane Connected:</span>
                <p className="disclaimer-text">
                  Consuming real-time telemetry from <code>ChaosResilience</code> backend.
                  Healthcheck endpoint (<code>GET /health</code>) verifies liveness every 5 seconds.
                  Automatic recovery policy (<code>restart: always</code>) active and monitored.
                </p>
              </>
            )}
          </div>

          {onRefresh && (
            <button
              type="button"
              className="refresh-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh telemetry"
            >
              <RotateCw size={14} className={isRefreshing ? 'spin-icon' : ''} />
              <span>{isRefreshing ? 'Polling...' : 'Refresh'}</span>
            </button>
          )}
        </div>

        {/* 4 Status Cards Grid */}
        <div className="status-cards-grid">
          {statusItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.id} className="status-card glass-card">
                <div className="status-card-top">
                  <div className={`status-icon-box ${item.accent}`}>
                    <Icon size={22} />
                  </div>
                  <div className={`status-badge ${item.badgeClass}`}>
                    <span className={`status-dot ${item.dotClass}`} />
                    <span className="status-value-text">{item.value}</span>
                  </div>
                </div>

                <div className="status-card-body">
                  <h3 className="status-card-title">{item.title}</h3>
                  <p className="status-card-desc">{item.description}</p>
                </div>

                <div className="status-card-footer">
                  <span className="future-endpoint-tag">Source: {item.endpoint}</span>
                  <span className="probe-rate">Interval: 5s</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sub-bar showing Node & Supervisor state */}
        <div className="system-meta-bar glass-card">
          <div className="meta-col">
            <span className="meta-label">Backend Link</span>
            <span className="meta-value">
              {status.isBackendConnected ? 'Connected (Flask 3.1)' : 'Offline (Unreachable)'}
            </span>
          </div>
          <div className="meta-divider" />
          <div className="meta-col">
            <span className="meta-label">Supervisor Mode</span>
            <span className="meta-value">
              {status.recoverySystem === 'ENABLED' ? 'Automated Docker Watchdog' : 'Not Configured (Task 4)'}
            </span>
          </div>
          <div className="meta-divider" />
          <div className="meta-col">
            <span className="meta-label">Last Timestamp</span>
            <span className="meta-value font-mono">
              {status.backendTimestamp ? status.backendTimestamp.slice(11, 19) + ' UTC' : '--:--:--'}
            </span>
          </div>
          <div className="meta-divider" />
          <div className="meta-col">
            <span className="meta-label">Environment</span>
            <span className="meta-value">Docker Compose Network</span>
          </div>
        </div>
      </div>

      <style>{`
        .system-status-section {
          background: linear-gradient(180deg, var(--bg-pitch) 0%, rgba(14, 14, 18, 0.6) 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .resilience-lifecycle-bar {
          padding: 1.25rem 1.75rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(18, 18, 24, 0.7);
        }

        .lifecycle-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .lifecycle-title-group {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          color: #94a3b8;
        }

        .lifecycle-heading {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .lifecycle-current-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.35rem 0.85rem;
          border-radius: 6px;
          letter-spacing: 0.05em;
        }

        .lifecycle-current-badge.normal {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }

        .lifecycle-current-badge.failure-detected {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.45);
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.25);
        }

        .lifecycle-current-badge.recovering {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.45);
        }

        .lifecycle-current-badge.recovered {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.45);
        }

        .lifecycle-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 8px currentColor;
          animation: pulse 1.5s infinite;
        }

        .lifecycle-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .lifecycle-step {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.9rem;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          opacity: 0.45;
          transition: all 0.3s ease;
        }

        .lifecycle-step.active-step {
          opacity: 1;
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.4);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.15);
        }

        .lifecycle-step.active-step.alert-step {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.5);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.25);
        }

        .lifecycle-step.active-step.warn-step {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.25);
        }

        .lifecycle-step.active-step.success-step {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
        }

        .step-number {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }

        .step-label {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #e2e8f0;
        }

        .lifecycle-connector {
          flex: 1;
          min-width: 15px;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .lifecycle-track {
            flex-direction: column;
            align-items: stretch;
          }
          .lifecycle-connector {
            display: none;
          }
        }

        .status-disclaimer-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          margin-bottom: 2.5rem;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .status-disclaimer-banner.loading {
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.25);
          border-left: 4px solid #06b6d4;
        }

        .status-disclaimer-banner.loading .disclaimer-icon,
        .status-disclaimer-banner.loading .disclaimer-title {
          color: #38bdf8;
        }

        .status-disclaimer-banner.error {
          background: rgba(229, 9, 20, 0.08);
          border: 1px solid rgba(229, 9, 20, 0.3);
          border-left: 4px solid var(--red-primary);
        }

        .status-disclaimer-banner.error .disclaimer-icon,
        .status-disclaimer-banner.error .disclaimer-title {
          color: #fca5a5;
        }

        .status-disclaimer-banner.connected {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-left: 4px solid var(--status-healthy);
        }

        .status-disclaimer-banner.connected .disclaimer-icon,
        .status-disclaimer-banner.connected .disclaimer-title {
          color: #34d399;
        }

        .disclaimer-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .disclaimer-content {
          flex: 1;
        }

        .disclaimer-title {
          font-weight: 700;
          font-size: 0.9rem;
          margin-right: 0.5rem;
          display: inline;
        }

        .disclaimer-text {
          font-size: 0.86rem;
          color: var(--text-muted);
          line-height: 1.5;
          display: inline;
        }

        .disclaimer-text code {
          background: rgba(0, 0, 0, 0.4);
          color: #f1f5f9;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-main);
          border: 1px solid var(--border-subtle);
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .refresh-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .status-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .status-card {
          padding: 1.6rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .status-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .status-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-subtle);
        }

        .status-icon-box.emerald {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border-color: rgba(16, 185, 129, 0.25);
        }

        .status-icon-box.cyan {
          background: rgba(6, 182, 212, 0.1);
          color: #22d3ee;
          border-color: rgba(6, 182, 212, 0.25);
        }

        .status-icon-box.red {
          background: rgba(229, 9, 20, 0.1);
          color: #fca5a5;
          border-color: rgba(229, 9, 20, 0.25);
        }

        .status-icon-box.neutral {
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          border-color: rgba(255, 255, 255, 0.1);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .status-badge.healthy {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
        }

        .status-badge.loading {
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.3);
          color: #38bdf8;
        }

        .status-badge.danger {
          background: rgba(229, 9, 20, 0.12);
          border: 1px solid rgba(229, 9, 20, 0.35);
          color: #fca5a5;
        }

        .status-badge.neutral {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .status-dot.healthy {
          background: var(--status-healthy);
          box-shadow: 0 0 8px var(--status-healthy);
        }

        .status-dot.loading {
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
        }

        .status-dot.danger {
          background: var(--status-danger);
          box-shadow: 0 0 8px var(--status-danger);
        }

        .status-dot.neutral {
          background: #64748b;
        }

        .status-card-title {
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }

        .status-card-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.45;
        }

        .status-card-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-dim);
        }

        .future-endpoint-tag {
          color: #94a3b8;
        }

        .system-meta-bar {
          padding: 1.25rem 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
          align-items: center;
          background: rgba(18, 18, 24, 0.6);
        }

        .meta-col {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .meta-label {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .meta-value.font-mono {
          font-family: var(--font-mono);
        }

        .meta-divider {
          display: none;
        }

        @media (min-width: 768px) {
          .meta-divider {
            display: block;
            width: 1px;
            height: 30px;
            background: rgba(255, 255, 255, 0.08);
          }
        }
      `}</style>
    </section>
  );
};
