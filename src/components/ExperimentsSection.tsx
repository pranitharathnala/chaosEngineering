import React, { useState } from 'react';
import { Zap, Eye, ServerOff, Skull, Bug, CheckCircle2, Play, Activity } from 'lucide-react';
import type { ChaosExperimentConfig, CurrentExperimentData } from '../types/chaos';
import { ExperimentModal } from './ExperimentModal';

interface ExperimentsSectionProps {
  experiments: ChaosExperimentConfig[];
  onTriggerExperiment?: (type: 'stop' | 'kill') => Promise<void>;
  isExecuting?: boolean;
  currentExperiment?: CurrentExperimentData | null;
}

export const ExperimentsSection: React.FC<ExperimentsSectionProps> = ({
  experiments,
  onTriggerExperiment,
  isExecuting = false,
  currentExperiment,
}) => {
  const [selectedExperiment, setSelectedExperiment] = useState<ChaosExperimentConfig | null>(null);

  const getExperimentIcon = (id: string) => {
    switch (id) {
      case 'exp-container-stop':
        return ServerOff;
      case 'exp-container-kill':
        return Skull;
      case 'exp-service-failure':
        return Bug;
      default:
        return Zap;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return <span className="risk-pill high">HIGH RISK</span>;
      case 'MEDIUM':
        return <span className="risk-pill medium">MEDIUM RISK</span>;
      case 'LOW':
        return <span className="risk-pill low">LOW RISK</span>;
      default:
        return <span className="risk-pill">{risk}</span>;
    }
  };

  const renderStatusBanner = () => {
    if (currentExperiment?.active) {
      return (
        <div className="experiments-active-banner glass-card" role="alert">
          <div className="banner-badge-group">
            <span className="live-dot-pulse" />
            <Activity size={16} className="active-icon-spin" />
            <span className="banner-badge-text">CHAOS INJECTION IN PROGRESS</span>
          </div>
          <div className="banner-status-desc">
            <strong>{currentExperiment.name || 'Experiment'}</strong> — State:{' '}
            <span className={`phase-badge ${currentExperiment.state.toLowerCase()}`}>
              {currentExperiment.state}
            </span>
            {currentExperiment.target && (
              <span className="target-pill">Target: {currentExperiment.target}</span>
            )}
            {typeof currentExperiment.elapsedSeconds === 'number' && (
              <span className="elapsed-pill">
                Elapsed: {currentExperiment.elapsedSeconds.toFixed(1)}s
              </span>
            )}
          </div>
        </div>
      );
    }

    if (currentExperiment?.lastResult && !currentExperiment.active) {
      return (
        <div className="experiments-success-banner glass-card">
          <div className="banner-badge-group success">
            <CheckCircle2 size={16} />
            <span className="banner-badge-text">LAST EXPERIMENT RESTORED</span>
          </div>
          <div className="banner-status-desc">
            <strong>{currentExperiment.lastResult.name}</strong> recovered in{' '}
            <span className="highlight-metric">
              {currentExperiment.lastResult.recoveryTimeSeconds.toFixed(2)}s
            </span>{' '}
            (Detection:{' '}
            <span className="highlight-metric">
              {currentExperiment.lastResult.failureDetectionTimeSeconds.toFixed(2)}s
            </span>
            ). Container auto-restarted and verified healthy!
          </div>
        </div>
      );
    }

    return (
      <div className="experiments-ready-banner glass-card">
        <div className="banner-badge-group ready">
          <Play size={16} />
          <span className="banner-badge-text">ACTIVE CHAOS CONTROLLER READY</span>
        </div>
        <p className="banner-text">
          Select an experiment below to inject controlled failures. The engine will trigger the outage,
          verify health degradation (HTTP 503), trigger automatic recovery, and record precision metrics.
        </p>
      </div>
    );
  };

  return (
    <section id="experiments" className="section experiments-section" aria-labelledby="experiments-title">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Zap size={14} />
            <span>Controlled Injections</span>
          </div>
          <h2 id="experiments-title" className="section-title">Chaos Experiments</h2>
          <p className="section-subtitle">
            Controlled failure scenarios designed to test graceful termination, crash tolerance,
            and automated container recovery.
          </p>
        </div>

        {/* Dynamic Status / Execution Banner */}
        {renderStatusBanner()}

        {/* 3 Experiment Cards Grid */}
        <div className="experiments-cards-grid">
          {experiments.map((exp) => {
            const Icon = getExperimentIcon(exp.id);
            return (
              <div key={exp.id} className="experiment-card glass-card">
                {/* Top Bar */}
                <div className="exp-card-header">
                  <div className="exp-icon-box">
                    <Icon size={24} />
                  </div>
                  <div className="exp-status-group">
                    {getRiskBadge(exp.riskLevel)}
                    <span className="exp-state-tag">
                      <span className="dot-ready" />
                      {exp.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="exp-card-body">
                  <span className="exp-category">{exp.tagline}</span>
                  <h3 className="exp-name">{exp.name}</h3>
                  <p className="exp-description">{exp.description}</p>
                </div>

                {/* Metadata Tags */}
                <div className="exp-tags-row">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="exp-meta-tag">{tag}</span>
                  ))}
                </div>

                {/* Card Action */}
                <div className="exp-card-footer">
                  <button
                    type="button"
                    className="btn-card-action"
                    onClick={() => setSelectedExperiment(exp)}
                    aria-label={`View Details and Run ${exp.name}`}
                  >
                    <Eye size={16} />
                    <span>View &amp; Execute</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Dialog */}
      <ExperimentModal
        experiment={selectedExperiment}
        onClose={() => setSelectedExperiment(null)}
        onTriggerExperiment={onTriggerExperiment}
        isExecuting={isExecuting}
        currentExperiment={currentExperiment}
      />

      <style>{`
        .experiments-section {
          background: linear-gradient(180deg, rgba(14, 14, 18, 0.6) 0%, var(--bg-pitch) 100%);
        }

        .experiments-active-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.15rem 1.5rem;
          margin-bottom: 2.5rem;
          border: 1px solid rgba(239, 68, 68, 0.5);
          background: rgba(239, 68, 68, 0.12);
          border-radius: var(--radius-md);
          box-shadow: 0 0 25px rgba(229, 9, 20, 0.2);
        }

        .experiments-success-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.15rem 1.5rem;
          margin-bottom: 2.5rem;
          border: 1px solid rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.08);
          border-radius: var(--radius-md);
        }

        .experiments-ready-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.15rem 1.5rem;
          margin-bottom: 2.5rem;
          border: 1px solid rgba(229, 9, 20, 0.25);
          background: rgba(229, 9, 20, 0.05);
          border-radius: var(--radius-md);
        }

        .banner-badge-group {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          color: #fca5a5;
          letter-spacing: 0.06em;
        }

        .banner-badge-group.success {
          color: #34d399;
        }

        .banner-badge-group.ready {
          color: #f87171;
        }

        .live-dot-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444;
          animation: pulse-dot 1.5s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        .active-icon-spin {
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .banner-status-desc {
          font-size: 0.88rem;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .phase-badge {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 0.75rem;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .phase-badge.running {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .phase-badge.failure_detected {
          background: rgba(239, 68, 68, 0.25);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.5);
        }

        .phase-badge.recovering {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.4);
        }

        .phase-badge.recovered {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .target-pill, .elapsed-pill {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          padding: 0.15rem 0.5rem;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          color: #cbd5e1;
        }

        .highlight-metric {
          font-family: var(--font-mono);
          color: #34d399;
          font-weight: 700;
        }

        .banner-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
        }

        .experiments-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .experiment-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
        }

        .experiment-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: transparent;
          transition: background 0.3s ease;
        }

        .experiment-card:hover {
          transform: translateY(-6px);
          border-color: rgba(229, 9, 20, 0.35);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(229, 9, 20, 0.12);
        }

        .experiment-card:hover::before {
          background: linear-gradient(90deg, transparent, var(--red-primary), transparent);
        }

        .exp-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .exp-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: rgba(229, 9, 20, 0.1);
          color: var(--red-primary);
          border: 1px solid rgba(229, 9, 20, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
        }

        .experiment-card:hover .exp-icon-box {
          background: var(--red-primary);
          color: #FFFFFF;
          box-shadow: 0 0 20px var(--red-glow);
        }

        .exp-status-group {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.4rem;
        }

        .risk-pill {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .risk-pill.low {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .risk-pill.medium {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .risk-pill.high {
          background: rgba(229, 9, 20, 0.2);
          color: #fca5a5;
          border: 1px solid rgba(229, 9, 20, 0.35);
        }

        .exp-state-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-dim);
        }

        .dot-ready {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
        }

        .exp-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .exp-category {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--red-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .exp-name {
          font-size: 1.4rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .exp-description {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin-top: 0.4rem;
        }

        .exp-tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .exp-meta-tag {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          background: rgba(255, 255, 255, 0.04);
          color: #94a3b8;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .exp-card-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .btn-card-action {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          color: #FFFFFF;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
          border: 1px solid var(--border-subtle);
          transition: all 0.2s ease;
        }

        .btn-card-action:hover {
          background: var(--red-primary);
          border-color: var(--red-primary);
          box-shadow: 0 4px 15px var(--red-glow);
        }
      `}</style>
    </section>
  );
};
