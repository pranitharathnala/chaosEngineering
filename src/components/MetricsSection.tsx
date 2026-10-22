import React from 'react';
import { BarChart3, Gauge, Clock, ShieldCheck, Flame, TrendingUp } from 'lucide-react';
import type { ResilienceMetricsData } from '../types/chaos';

interface MetricsSectionProps {
  metrics: ResilienceMetricsData;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({ metrics }) => {
  const metricCards = [
    {
      id: 'exp-executed',
      title: 'Experiments Executed',
      value: metrics.experimentsExecuted.toString(),
      unit: 'runs',
      icon: Flame,
      color: 'red',
      description: 'Total fault injections triggered on target instances',
      targetStat: 'Awaiting execution'
    },
    {
      id: 'success-recoveries',
      title: 'Successful Recoveries',
      value: metrics.successfulRecoveries.toString(),
      unit: 'events',
      icon: ShieldCheck,
      color: 'emerald',
      description: 'Confirmed automated restarts with 200 OK health verification',
      targetStat: 'Zero downtime target'
    },
    {
      id: 'recovery-rate',
      title: 'Recovery Success Rate',
      value: metrics.recoverySuccessRate,
      unit: metrics.recoverySuccessRate === '--' ? '' : '%',
      icon: Gauge,
      color: 'cyan',
      description: 'Ratio of recovered faults versus total chaos injections',
      targetStat: 'Benchmark goal: 100%'
    },
    {
      id: 'avg-recovery-time',
      title: 'Average Recovery Time',
      value: metrics.averageRecoveryTime,
      unit: metrics.averageRecoveryTime === '--' ? '' : 'sec',
      icon: Clock,
      color: 'amber',
      description: 'Mean elapsed time between fault injection and full service recovery',
      targetStat: 'Target SLA: < 5.0s'
    },
  ];

  return (
    <section id="metrics" className="section metrics-section" aria-labelledby="metrics-title">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <BarChart3 size={14} />
            <span>Resilience Benchmarks</span>
          </div>
          <h2 id="metrics-title" className="section-title">Resilience Metrics</h2>
          <p className="section-subtitle">
            Quantitative reliability metrics measured during active chaos experiments.
            Telemetry is dynamically calculated once chaos trials are dispatched.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="metrics-cards-grid">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.id} className="metric-card glass-card">
                <div className="metric-card-header">
                  <div className={`metric-icon-box ${card.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="metric-status-sub">{card.targetStat}</span>
                </div>

                <div className="metric-card-content">
                  <div className="metric-value-row">
                    <span className="metric-number-display">{card.value}</span>
                    {card.unit && <span className="metric-unit-text">{card.unit}</span>}
                  </div>
                  <h3 className="metric-card-title">{card.title}</h3>
                  <p className="metric-card-desc">{card.description}</p>
                </div>

                <div className="metric-card-footer">
                  <span className="metric-footer-note">Telemetry ready for /metrics</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary KPI Banner */}
        <div className="metrics-kpi-banner glass-card">
          <div className="kpi-info-group">
            <TrendingUp size={20} className="text-red" />
            <div>
              <span className="kpi-bold">Telemetry Pipeline Standby:</span>
              <span className="kpi-detail">
                No simulated or mocked metrics are injected into this display. Metrics start at baseline zero and null indicators until live experiments run.
              </span>
            </div>
          </div>
          <div className="kpi-badge">
            PROMETHEUS/GRAFANA READY
          </div>
        </div>
      </div>

      <style>{`
        .metrics-section {
          background-color: var(--bg-primary);
          position: relative;
        }

        .metrics-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border-top: 2px solid transparent;
        }

        .metric-card:hover {
          border-top-color: var(--red-primary);
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(229, 9, 20, 0.1);
        }

        .metric-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .metric-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-subtle);
        }

        .metric-icon-box.red {
          background: rgba(229, 9, 20, 0.12);
          color: var(--red-primary);
          border-color: rgba(229, 9, 20, 0.3);
        }

        .metric-icon-box.emerald {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          border-color: rgba(16, 185, 129, 0.3);
        }

        .metric-icon-box.cyan {
          background: rgba(6, 182, 212, 0.12);
          color: #22d3ee;
          border-color: rgba(6, 182, 212, 0.3);
        }

        .metric-icon-box.amber {
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
          border-color: rgba(245, 158, 11, 0.3);
        }

        .metric-status-sub {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-dim);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .metric-value-row {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
        }

        .metric-number-display {
          font-family: var(--font-mono);
          font-size: 2.75rem;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1;
        }

        .metric-unit-text {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .metric-card-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: #f1f5f9;
        }

        .metric-card-desc {
          font-size: 0.84rem;
          color: var(--text-muted);
          line-height: 1.45;
        }

        .metric-card-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .metric-footer-note {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-dim);
        }

        .metrics-kpi-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.25rem;
          padding: 1.2rem 1.75rem;
          background: rgba(20, 20, 28, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .kpi-info-group {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        .kpi-bold {
          font-weight: 600;
          color: #f8fafc;
          margin-right: 0.4rem;
        }

        .kpi-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          letter-spacing: 0.06em;
        }
      `}</style>
    </section>
  );
};
