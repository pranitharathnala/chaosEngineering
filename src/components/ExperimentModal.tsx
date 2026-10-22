import React, { useEffect, useState } from 'react';
import { X, ShieldAlert, Terminal, Target, Play, RotateCw, CheckCircle2, AlertOctagon } from 'lucide-react';
import type { ChaosExperimentConfig, CurrentExperimentData } from '../types/chaos';

interface ExperimentModalProps {
  experiment: ChaosExperimentConfig | null;
  onClose: () => void;
  onTriggerExperiment?: (type: 'stop' | 'kill') => Promise<void>;
  isExecuting?: boolean;
  currentExperiment?: CurrentExperimentData | null;
}

export const ExperimentModal: React.FC<ExperimentModalProps> = ({
  experiment,
  onClose,
  onTriggerExperiment,
  isExecuting = false,
  currentExperiment,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!experiment) return null;

  const getRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'risk-high';
      case 'MEDIUM':
        return 'risk-med';
      default:
        return 'risk-low';
    }
  };

  const getExperimentType = (): 'stop' | 'kill' | null => {
    if (experiment.id === 'exp-container-stop') return 'stop';
    if (experiment.id === 'exp-container-kill') return 'kill';
    return 'stop'; // default fallback for service failure
  };

  const handleRun = async () => {
    const expType = getExperimentType();
    if (!expType || !onTriggerExperiment) return;

    setErrorMessage(null);
    try {
      await onTriggerExperiment(expType);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to initiate experiment');
      }
    }
  };

  const expType = getExperimentType();
  const isCurrentRunning =
    isExecuting ||
    (currentExperiment?.state &&
      ['RUNNING', 'FAILURE_DETECTED', 'RECOVERING'].includes(currentExperiment.state));

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-container glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className={`risk-badge ${getRiskBadgeClass(experiment.riskLevel)}`}>
              {experiment.riskLevel} RISK
            </span>
            <span className="modal-status-pill">
              TARGET: {experiment.targetComponent}
            </span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close experiment details modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="modal-title-group">
            <h3 id="modal-title" className="modal-title">{experiment.name}</h3>
            <p className="modal-tagline">{experiment.tagline}</p>
          </div>

          {/* Active Live Progress Banner if currently executing */}
          {currentExperiment && currentExperiment.state !== 'IDLE' && (
            <div className={`modal-live-banner ${currentExperiment.state.toLowerCase()}`}>
              <div className="live-banner-left">
                {['RUNNING', 'RECOVERING'].includes(currentExperiment.state) && (
                  <RotateCw size={16} className="spin-icon" />
                )}
                {currentExperiment.state === 'FAILURE_DETECTED' && <AlertOctagon size={16} />}
                {currentExperiment.state === 'RECOVERED' && <CheckCircle2 size={16} />}
                <span className="live-banner-text">
                  STATE: <strong>{currentExperiment.state}</strong> —{' '}
                  {currentExperiment.details?.message || 'Processing resilience lifecycle...'}
                </span>
              </div>
            </div>
          )}

          {/* Error notice if trigger failed */}
          {errorMessage && (
            <div className="modal-error-notice">
              <ShieldAlert size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Safety Notice */}
          <div className="modal-safety-notice">
            <ShieldAlert size={18} className="text-red" />
            <div>
              <strong>Controlled Chaos Guardrails:</strong>
              <p>
                This experiment targets only the ChaosResilience application service with bounded blast radius.
                Automated supervisor watchdog and Docker restart policies are configured to restore service baseline.
              </p>
            </div>
          </div>

          {/* Detailed Specifications */}
          <div className="modal-specs-grid">
            <div className="spec-card">
              <span className="spec-label">
                <Target size={14} />
                Target Component
              </span>
              <span className="spec-value">{experiment.targetComponent}</span>
            </div>

            <div className="spec-card">
              <span className="spec-label">
                <Terminal size={14} />
                Blast Radius
              </span>
              <span className="spec-value">{experiment.blastRadius}</span>
            </div>
          </div>

          <div className="modal-narrative-section">
            <h4 className="narrative-heading">Detailed Description</h4>
            <p className="narrative-text">{experiment.description}</p>
          </div>

          <div className="modal-narrative-section">
            <h4 className="narrative-heading">Experiment Hypothesis</h4>
            <p className="narrative-text highlight-box">{experiment.hypothesis}</p>
          </div>

          <div className="modal-narrative-section">
            <h4 className="narrative-heading">Expected Self-Healing Behavior</h4>
            <div className="recovery-item">
              <CheckCircle2 size={16} className="text-emerald" />
              <p className="narrative-text">{experiment.expectedRecovery}</p>
            </div>
          </div>

          {/* Command Preview */}
          <div className="modal-command-box">
            <div className="cmd-header">
              <Terminal size={14} />
              <span>Target Controller API Trigger</span>
            </div>
            <pre className="cmd-code">
              <code>POST /api/experiments/{expType || 'stop'}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleRun}
            disabled={isCurrentRunning}
            title={isCurrentRunning ? 'Experiment in progress' : `Trigger ${experiment.name}`}
          >
            {isCurrentRunning ? (
              <>
                <RotateCw size={16} className="spin-icon" />
                <span>Running Lifecycle...</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Execute {experiment.name}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container {
          background: rgba(18, 18, 24, 0.95);
          border: 1px solid rgba(229, 9, 20, 0.3);
          border-radius: var(--radius-xl);
          max-width: 650px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(229, 9, 20, 0.15);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .modal-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .risk-badge {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .risk-low {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .risk-med {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .risk-high {
          background: rgba(229, 9, 20, 0.2);
          color: #fca5a5;
          border: 1px solid rgba(229, 9, 20, 0.4);
        }

        .modal-status-pill {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .modal-close-btn {
          color: var(--text-muted);
          padding: 0.3rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-body {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }

        .modal-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .modal-tagline {
          font-size: 0.95rem;
          color: var(--red-primary);
          font-weight: 500;
        }

        .modal-live-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          animation: pulse 2s infinite ease-in-out;
        }

        .modal-live-banner.running {
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.35);
          color: #fbbf24;
        }

        .modal-live-banner.failure_detected {
          background: rgba(229, 9, 20, 0.18);
          border: 1px solid rgba(229, 9, 20, 0.4);
          color: #fca5a5;
        }

        .modal-live-banner.recovering {
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid rgba(6, 182, 212, 0.35);
          color: #38bdf8;
        }

        .modal-live-banner.recovered {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
        }

        .live-banner-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .modal-error-notice {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(229, 9, 20, 0.15);
          border: 1px solid rgba(229, 9, 20, 0.3);
          color: #fca5a5;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
        }

        .modal-safety-notice {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          background: rgba(229, 9, 20, 0.08);
          border: 1px solid rgba(229, 9, 20, 0.25);
          padding: 0.85rem 1.15rem;
          border-radius: var(--radius-md);
          font-size: 0.84rem;
          color: #fca5a5;
          line-height: 1.45;
        }

        .modal-safety-notice strong {
          display: block;
          margin-bottom: 0.2rem;
          color: #fee2e2;
        }

        .modal-safety-notice p {
          color: #e2e8f0;
          margin: 0;
        }

        .modal-specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .spec-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .spec-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .spec-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .narrative-heading {
          font-size: 0.92rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .narrative-text {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.55;
        }

        .highlight-box {
          background: rgba(255, 255, 255, 0.03);
          border-left: 3px solid var(--red-primary);
          padding: 0.65rem 0.85rem;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          color: #f1f5f9;
        }

        .recovery-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .modal-command-box {
          background: #08080a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .cmd-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.85rem;
          background: rgba(255, 255, 255, 0.04);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-dim);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .cmd-code {
          padding: 0.85rem 1rem;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: #38bdf8;
          overflow-x: auto;
        }

        .modal-footer {
          padding: 1.25rem 1.75rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          background: rgba(14, 14, 18, 0.8);
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
