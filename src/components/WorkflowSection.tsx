import React from 'react';
import { 
  Workflow, 
  CheckCircle2, 
  Flame, 
  Radar, 
  RotateCcw, 
  HeartPulse, 
  ShieldCheck, 
  ArrowDown, 
  ArrowRight 
} from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Normal Operation',
      subtitle: 'Baseline Steady State',
      description: 'The microservice container runs stably behind reverse proxy routing with 200 OK responses and steady traffic distribution.',
      icon: CheckCircle2,
      accent: 'emerald',
      badge: 'STEADY STATE'
    },
    {
      step: '02',
      title: 'Inject Controlled Failure',
      subtitle: 'Operator Triggered Chaos',
      description: 'Controlled fault injected (SIGTERM container halt, SIGKILL process crash, or HTTP 500 error cascade) within a strict blast radius.',
      icon: Flame,
      accent: 'red',
      badge: 'CHAOS INJECTION'
    },
    {
      step: '03',
      title: 'Detect Failure',
      subtitle: 'Automated Telemetry Probe',
      description: 'Health monitor probe records consecutive socket or HTTP probe timeouts. Telemetry system registers Failure Detection Time (FDT).',
      icon: Radar,
      accent: 'amber',
      badge: 'FAULT DETECTED'
    },
    {
      step: '04',
      title: 'Automatic Recovery',
      subtitle: 'Self-Healing Engine',
      description: 'Resilience supervisor watchdog intervenes immediately without human assistance, provisioning a replacement container or restarting daemon.',
      icon: RotateCcw,
      accent: 'cyan',
      badge: 'AUTO RESTART'
    },
    {
      step: '05',
      title: 'Health Check',
      subtitle: 'Validation & Warm-up',
      description: 'Synthetic health probes poll the /health endpoint until consecutive 200 OK signals verify application readiness.',
      icon: HeartPulse,
      accent: 'emerald',
      badge: 'VERIFICATION'
    },
    {
      step: '06',
      title: 'Service Restored',
      subtitle: 'Resilience Recorded',
      description: 'Traffic resumes at 100% capacity. Total recovery duration, MTTR, and outcome logged to the resilience metrics telemetry ledger.',
      icon: ShieldCheck,
      accent: 'emerald',
      badge: 'FULLY RECOVERED'
    }
  ];

  return (
    <section id="how-it-works" className="section workflow-section" aria-labelledby="workflow-title">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Workflow size={14} />
            <span>Resilience Loop</span>
          </div>
          <h2 id="workflow-title" className="section-title">How It Works</h2>
          <p className="section-subtitle">
            The closed-loop resilience lifecycle: from steady state validation through controlled chaos
            injection to automated self-healing recovery.
          </p>
        </div>

        {/* Workflow Timeline / Flow Grid */}
        <div className="workflow-timeline">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={item.step}>
                <div className="workflow-card glass-card">
                  {/* Card Step Badge & Icon */}
                  <div className="workflow-card-top">
                    <div className="step-number-pill">
                      <span>STEP {item.step}</span>
                    </div>
                    <span className={`workflow-badge ${item.accent}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Icon Circle */}
                  <div className={`workflow-icon-circle ${item.accent}`}>
                    <Icon size={24} />
                  </div>

                  {/* Title & Info */}
                  <div className="workflow-content">
                    <h3 className="workflow-title">{item.title}</h3>
                    <span className="workflow-sub">{item.subtitle}</span>
                    <p className="workflow-desc">{item.description}</p>
                  </div>

                  {/* Bottom Progress Accent */}
                  <div className={`workflow-accent-bar ${item.accent}`} />
                </div>

                {/* Connecting arrow for larger screens and mobile */}
                {!isLast && (
                  <div className="flow-connector" aria-hidden="true">
                    <div className="connector-line" />
                    <div className="connector-arrow">
                      <ArrowDown size={18} className="arrow-down" />
                      <ArrowRight size={18} className="arrow-right" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <style>{`
        .workflow-section {
          background: linear-gradient(180deg, var(--bg-pitch) 0%, rgba(14, 14, 20, 0.8) 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .workflow-timeline {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          max-width: 900px;
          margin: 0 auto;
        }

        @media (min-width: 992px) {
          .workflow-timeline {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.75rem;
            max-width: 100%;
          }

          .flow-connector {
            display: none !important;
          }
        }

        .workflow-card {
          width: 100%;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: relative;
          border: 1px solid var(--border-subtle);
          background: rgba(18, 18, 24, 0.8);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .workflow-card:hover {
          transform: translateY(-4px);
          border-color: rgba(229, 9, 20, 0.35);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(229, 9, 20, 0.1);
        }

        .workflow-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .step-number-pill {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          letter-spacing: 0.08em;
        }

        .workflow-badge {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .workflow-badge.emerald {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .workflow-badge.red {
          background: rgba(229, 9, 20, 0.18);
          color: #fca5a5;
          border: 1px solid rgba(229, 9, 20, 0.35);
        }

        .workflow-badge.amber {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .workflow-badge.cyan {
          background: rgba(6, 182, 212, 0.15);
          color: #22d3ee;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .workflow-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.25rem;
        }

        .workflow-icon-circle.emerald {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .workflow-icon-circle.red {
          background: rgba(229, 9, 20, 0.12);
          color: var(--red-primary);
          border: 1px solid rgba(229, 9, 20, 0.3);
          box-shadow: 0 0 15px rgba(229, 9, 20, 0.2);
        }

        .workflow-icon-circle.amber {
          background: rgba(245, 158, 11, 0.1);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .workflow-icon-circle.cyan {
          background: rgba(6, 182, 212, 0.1);
          color: #22d3ee;
          border: 1px solid rgba(6, 182, 212, 0.25);
        }

        .workflow-content {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .workflow-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .workflow-sub {
          font-size: 0.8rem;
          font-family: var(--font-mono);
          color: var(--red-primary);
          letter-spacing: 0.02em;
        }

        .workflow-desc {
          font-size: 0.86rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin-top: 0.5rem;
        }

        .workflow-accent-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .workflow-accent-bar.emerald { background: var(--status-healthy); }
        .workflow-accent-bar.red { background: var(--red-primary); }
        .workflow-accent-bar.amber { background: var(--status-warning); }
        .workflow-accent-bar.cyan { background: var(--status-cyan); }

        .flow-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 0;
          color: var(--red-primary);
          opacity: 0.7;
        }

        .arrow-right {
          display: none;
        }

        .arrow-down {
          display: block;
        }
      `}</style>
    </section>
  );
};
