import React from 'react';
import { Cpu, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-root" role="contentinfo">
      <div className="container footer-container">
        {/* Main Footer Row */}
        <div className="footer-main-row">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <Cpu size={20} />
              </div>
              <span className="footer-brand-name">
                CHAOS<span className="text-red">RESILIENCE</span>
              </span>
            </div>
            <p className="footer-brand-desc">
              A high-reliability educational DevOps laboratory for controlled chaos injection,
              automated failover monitoring, and telemetry validation.
            </p>
            <div className="footer-tags-pill">
              DevOps • Chaos Engineering • Resilience Engineering
            </div>
          </div>

          <div className="footer-links-col">
            <span className="footer-col-heading">Navigation</span>
            <ul className="footer-links-list">
              <li><a href="#hero">Overview</a></li>
              <li><a href="#system-status">System Health</a></li>
              <li><a href="#metrics">Resilience Metrics</a></li>
              <li><a href="#experiments">Chaos Experiments</a></li>
              <li><a href="#how-it-works">Resilience Loop</a></li>
              <li><a href="#about-concept">Netflix Concept</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <span className="footer-col-heading">Architecture</span>
            <ul className="footer-links-list">
              <li><span className="footer-text-link">Docker Containerization</span></li>
              <li><span className="footer-text-link">Health Probing (/health)</span></li>
              <li><span className="footer-text-link">Automated Supervisor</span></li>
              <li><span className="footer-text-link">Prometheus Ready</span></li>
              <li><span className="footer-text-link">Failure Injection API</span></li>
            </ul>
          </div>

          <div className="footer-academic-col">
            <span className="footer-col-heading">Project Notice</span>
            <div className="academic-badge-box">
              <Shield size={16} className="text-red" />
              <span>Educational Proof of Concept</span>
            </div>
            <p className="academic-disclaimer">
              Built for collegiate DevOps study and technical demonstration.
              Inspired by Netflix's resilience methodology without copying proprietary infrastructure.
            </p>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom-bar">
          <div className="bottom-left">
            <span>© {new Date().getFullYear()} ChaosResilience. Educational Proof of Concept.</span>
          </div>
          <div className="bottom-right">
            <span>Designed for College DevOps Presentation</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-root {
          background-color: #060608;
          border-top: 1px solid var(--border-subtle);
          padding-top: 4.5rem;
          padding-bottom: 2.5rem;
          position: relative;
          z-index: 10;
        }

        .footer-container {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        .footer-main-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }

        @media (min-width: 768px) {
          .footer-main-row {
            grid-template-columns: 1.5fr 1fr 1fr 1.25fr;
          }
        }

        .footer-brand-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .footer-logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(229, 9, 20, 0.12);
          border: 1px solid rgba(229, 9, 20, 0.3);
          color: var(--red-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-brand-name {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: 0.04em;
          color: #FFFFFF;
        }

        .footer-brand-desc {
          font-size: 0.86rem;
          color: var(--text-muted);
          line-height: 1.55;
        }

        .footer-tags-pill {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #fca5a5;
          background: rgba(229, 9, 20, 0.08);
          border: 1px solid rgba(229, 9, 20, 0.2);
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          width: fit-content;
        }

        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-col-heading {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #f1f5f9;
        }

        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .footer-links-list a {
          font-size: 0.86rem;
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .footer-links-list a:hover {
          color: var(--red-primary);
        }

        .footer-text-link {
          font-size: 0.86rem;
          color: var(--text-dim);
        }

        .footer-academic-col {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .academic-badge-box {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.84rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .academic-disclaimer {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.55;
        }

        .footer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding-top: 1.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-dim);
        }
      `}</style>
    </footer>
  );
};
