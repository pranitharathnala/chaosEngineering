import React from 'react';
import { BookOpen, ShieldCheck, Layers, Terminal, AlertOctagon } from 'lucide-react';

export const EducationalSection: React.FC = () => {
  const conceptPoints = [
    {
      title: 'The Simian Army Origin',
      text: 'In 2011, Netflix pioneered Chaos Monkey to proactively terminate virtual machine instances in production, proving that systems must expect and gracefully withstand random node outages.',
      icon: Terminal,
    },
    {
      title: 'Hypothesis-Driven Testing',
      text: 'Chaos engineering is not breaking things recklessly; it defines a steady-state hypothesis, injects precise turbulence within a bounded blast radius, and measures variance.',
      icon: Layers,
    },
    {
      title: 'Automated Recovery & Self-Healing',
      text: 'Resilience is measured by how swiftly an orchestration watchdog detects degradation and returns the system to a healthy baseline without requiring manual operational triage.',
      icon: ShieldCheck,
    }
  ];

  return (
    <section id="about-concept" className="section educational-section" aria-labelledby="educational-title">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <BookOpen size={14} />
            <span>DevOps Case Study</span>
          </div>
          <h2 id="educational-title" className="section-title">Netflix Resilience Concept</h2>
          <p className="section-subtitle">
            Academic context, architectural motivations, and engineering principles behind controlled failure injection.
          </p>
        </div>

        {/* Required Prominent Notice */}
        <div className="educational-disclaimer-box glass-card">
          <div className="disclaimer-badge-wrap">
            <AlertOctagon size={24} className="text-red" />
          </div>
          <div className="disclaimer-text-wrap">
            <h3 className="disclaimer-headline">Educational Scope & Attribution</h3>
            <p className="disclaimer-quote">
              "This project is an educational proof of concept and does not reproduce Netflix's production infrastructure."
            </p>
            <p className="disclaimer-narrative">
              ChaosResilience is an educational implementation inspired by the resilience engineering practices pioneered by Netflix and the open-source Chaos Monkey methodology. It provides a compact demonstration environment for computer science and DevOps students to explore automated self-healing in containerized microservices.
            </p>
          </div>
        </div>

        {/* Concept Cards Grid */}
        <div className="concept-cards-grid">
          {conceptPoints.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="concept-card glass-card">
                <div className="concept-icon-box">
                  <Icon size={22} />
                </div>
                <h3 className="concept-title">{item.title}</h3>
                <p className="concept-text">{item.text}</p>
              </div>
            );
          })}
        </div>

        {/* Comparison Table / Architecture Scope */}
        <div className="scope-comparison-panel glass-card">
          <div className="comparison-header">
            <h3 className="comparison-title">Architecture Alignment: Enterprise vs. Educational PoC</h3>
          </div>
          <div className="comparison-grid">
            <div className="comparison-col">
              <span className="col-tag enterprise">Netflix Production Scale</span>
              <ul className="comparison-list">
                <li>Global multi-region cloud deployment (AWS)</li>
                <li>Simian Army & Chaos Automation Platform (ChAP)</li>
                <li>Automated canary analysis on live viewer traffic</li>
                <li>Distributed microservices mesh at hyper-scale</li>
              </ul>
            </div>

            <div className="comparison-divider" />

            <div className="comparison-col">
              <span className="col-tag poc">ChaosResilience Educational PoC</span>
              <ul className="comparison-list">
                <li>Isolated local Docker container testbed</li>
                <li>Controlled process halts (SIGTERM, SIGKILL, HTTP 500)</li>
                <li>Automated restart watchdog & health probe measurement</li>
                <li>Accessible, verifiable metrics for DevOps coursework</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .educational-section {
          background-color: var(--bg-primary);
        }

        .educational-disclaimer-box {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          padding: 2rem 2.25rem;
          border-left: 5px solid var(--red-primary);
          background: rgba(229, 9, 20, 0.05);
          margin-bottom: 3.5rem;
          border-radius: var(--radius-lg);
        }

        .disclaimer-badge-wrap {
          flex-shrink: 0;
          margin-top: 4px;
        }

        .disclaimer-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .disclaimer-headline {
          font-size: 1.2rem;
          font-weight: 700;
          color: #f1f5f9;
        }

        .disclaimer-quote {
          font-size: 1.05rem;
          font-weight: 600;
          color: #fca5a5;
          line-height: 1.5;
          font-style: italic;
          background: rgba(229, 9, 20, 0.1);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-sm);
          border: 1px dashed rgba(229, 9, 20, 0.3);
        }

        .disclaimer-narrative {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .concept-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.75rem;
          margin-bottom: 3.5rem;
        }

        .concept-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .concept-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(229, 9, 20, 0.1);
          color: var(--red-primary);
          border: 1px solid rgba(229, 9, 20, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .concept-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .concept-text {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .scope-comparison-panel {
          padding: 2rem 2.5rem;
          border: 1px solid var(--border-subtle);
        }

        .comparison-header {
          margin-bottom: 1.75rem;
          text-align: center;
        }

        .comparison-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .comparison-grid {
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
          }

          .comparison-divider {
            width: 1px;
            height: 140px;
            background: rgba(255, 255, 255, 0.08);
          }
        }

        .comparison-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .col-tag {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
          width: fit-content;
          letter-spacing: 0.06em;
        }

        .col-tag.enterprise {
          background: rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
        }

        .col-tag.poc {
          background: rgba(229, 9, 20, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(229, 9, 20, 0.3);
        }

        .comparison-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .comparison-list li {
          font-size: 0.88rem;
          color: var(--text-muted);
          position: relative;
          padding-left: 1.25rem;
          line-height: 1.45;
        }

        .comparison-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--red-primary);
          font-weight: bold;
        }
      `}</style>
    </section>
  );
};
