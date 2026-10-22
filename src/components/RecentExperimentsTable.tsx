import React from 'react';
import { History, Database } from 'lucide-react';
import type { ExperimentRecord } from '../types/chaos';

interface RecentExperimentsTableProps {
  records: ExperimentRecord[];
}

export const RecentExperimentsTable: React.FC<RecentExperimentsTableProps> = ({ records }) => {
  return (
    <section id="recent-experiments" className="section recent-section" aria-labelledby="recent-title">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <History size={14} />
            <span>Audit & Verification</span>
          </div>
          <h2 id="recent-title" className="section-title">Recent Experiments</h2>
          <p className="section-subtitle">
            Historical logs of executed chaos trials, failure detection intervals, and automated recovery timestamps.
          </p>
        </div>

        {/* Table Container Card */}
        <div className="table-wrapper glass-card">
          <div className="table-top-bar">
            <div className="table-title-group">
              <span className="table-heading">Experiment Execution Log</span>
              <span className="table-sub-badge">ENDPOINT: GET /api/experiments</span>
            </div>
            <div className="table-counter">
              <span>Total Entries: {records.length}</span>
            </div>
          </div>

          <div className="table-scroll-container">
            <table className="experiments-table" role="table">
              <thead>
                <tr>
                  <th scope="col">Experiment</th>
                  <th scope="col">Failure Type</th>
                  <th scope="col">Detection Time</th>
                  <th scope="col">Recovery Time</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state-cell">
                      <div className="table-empty-state">
                        <div className="empty-icon-wrap">
                          <Database size={32} />
                        </div>
                        <h3 className="empty-title">No experiments executed yet.</h3>
                        <p className="empty-desc">
                          The chaos execution history is currently clean. When failure injection experiments
                          are triggered in future phases, automated detection latency and recovery timestamps will be logged here.
                        </p>
                        <span className="empty-ready-badge">
                          Database Audit Schema Ready
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="table-row">
                      <td className="cell-primary">
                        <span className="cell-exp-name">{record.experiment}</span>
                        <span className="cell-time-sub">{record.executedAt}</span>
                      </td>
                      <td className="cell-mono">{record.failureType}</td>
                      <td className="cell-mono">{record.detectionTime}</td>
                      <td className="cell-mono">{record.recoveryTime}</td>
                      <td>
                        <span className={`status-pill-table ${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .recent-section {
          background-color: var(--bg-primary);
        }

        .table-wrapper {
          overflow: hidden;
          border: 1px solid var(--border-subtle);
        }

        .table-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.75rem;
          background: rgba(14, 14, 18, 0.95);
          border-bottom: 1px solid var(--border-subtle);
        }

        .table-title-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .table-heading {
          font-size: 1.05rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .table-sub-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-dim);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .table-counter {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .table-scroll-container {
          overflow-x: auto;
          width: 100%;
        }

        .experiments-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }

        .experiments-table th {
          background: rgba(18, 18, 24, 0.7);
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
          white-space: nowrap;
        }

        .experiments-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .table-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .cell-primary {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .cell-exp-name {
          font-weight: 600;
          color: #FFFFFF;
        }

        .cell-time-sub {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }

        .cell-mono {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: #cbd5e1;
        }

        .status-pill-table {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
        }

        .status-pill-table.recovered {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-pill-table.failed {
          background: rgba(229, 9, 20, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(229, 9, 20, 0.3);
        }

        /* Empty State */
        .empty-state-cell {
          padding: 4rem 1.5rem !important;
          text-align: center;
        }

        .table-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 500px;
          margin: 0 auto;
        }

        .empty-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: rgba(229, 9, 20, 0.08);
          border: 1px solid rgba(229, 9, 20, 0.2);
          color: var(--red-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 0.5rem;
        }

        .empty-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: 1.25rem;
        }

        .empty-ready-badge {
          display: inline-flex;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </section>
  );
};
