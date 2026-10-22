import React from 'react';
import { Activity, Terminal, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

interface HeroProps {
  onExploreExperiments?: () => void;
  onViewHealth?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreExperiments, onViewHealth }) => {
  return (
    <section id="hero" className="hero-section" aria-labelledby="hero-heading">
      {/* Background Abstract Cyber-Resilience Visual */}
      <div className="hero-cyber-bg" aria-hidden="true">
        <div className="grid-overlay" />
        <div className="ambient-spotlight" />
        <div className="vignette-layer" />
        
        {/* Abstract SVG Circuit & Resilience Lattice */}
        <svg className="resilience-svg-canvas" viewBox="0 0 1000 600" fill="none">
          <defs>
            <linearGradient id="cyberRedLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E50914" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#E50914" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E50914" stopOpacity="0.1" />
            </linearGradient>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E50914" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Abstract Cyber Grid Lines */}
          <path d="M50 300 H950 M50 150 H950 M50 450 H950" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8" />
          <path d="M250 50 V550 M500 50 V550 M750 50 V550" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8" />

          {/* Fault Simulation Waveform */}
          <path
            d="M 100 300 L 320 300 L 360 210 L 410 420 L 460 260 L 510 340 L 560 300 L 900 300"
            stroke="url(#cyberRedLine)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pulse-path"
          />

          {/* Nodes */}
          <circle cx="360" cy="210" r="14" fill="url(#nodeGlow)" />
          <circle cx="360" cy="210" r="4" fill="#FFFFFF" />
          
          <circle cx="410" cy="420" r="16" fill="url(#nodeGlow)" />
          <circle cx="410" cy="420" r="4" fill="#E50914" />

          <circle cx="560" cy="300" r="12" fill="url(#nodeGlow)" />
          <circle cx="560" cy="300" r="4" fill="#10B981" />
        </svg>
      </div>

      <div className="container hero-container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-pill-badge">
            <span className="hero-pill-pulse" />
            <span className="hero-pill-text">DevOps Chaos Engineering PoC</span>
            <span className="hero-pill-divider">•</span>
            <span className="hero-pill-sub">Self-Healing Architecture</span>
          </div>

          {/* Main Title */}
          <h1 id="hero-heading" className="hero-title">
            CHAOS<span className="text-red">RESILIENCE</span>
          </h1>

          {/* Main Tagline */}
          <p className="hero-tagline">
            Test Failure. Measure Resilience. Recover Automatically.
          </p>

          {/* Description */}
          <p className="hero-description">
            A DevOps resilience engineering platform for controlled chaos experiments and automated recovery.
            Designed to validate application survivability under simulated container crashes, process halts, and service degradations.
          </p>

          {/* CTA Buttons */}
          <div className="hero-actions">
            <a
              href="#system-status"
              className="btn-primary"
              onClick={onViewHealth}
            >
              <Activity size={18} />
              View System Health
            </a>
            <a
              href="#experiments"
              className="btn-secondary"
              onClick={onExploreExperiments}
            >
              <Zap size={18} className="text-red" />
              Explore Experiments
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Quick Architecture Highlights */}
          <div className="hero-highlights">
            <div className="highlight-item">
              <CheckCircle2 size={16} className="text-emerald" />
              <span>Supervisor Watchdog Ready</span>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={16} className="text-emerald" />
              <span>Non-Destructive Blast Radius</span>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={16} className="text-emerald" />
              <span>Automated Recovery Loop</span>
            </div>
          </div>
        </div>

        {/* Cinematic Telemetry HUD Preview Card */}
        <div className="hero-hud-card-wrapper">
          <div className="hero-hud-card glass-card">
            <div className="hud-card-header">
              <div className="terminal-dots">
                <span className="dot dot-red" />
                <span className="dot dot-amber" />
                <span className="dot dot-green" />
              </div>
              <div className="hud-header-title">
                <Terminal size={14} />
                <span>telemetry_monitor.sh</span>
              </div>
              <span className="hud-badge-live">STANDBY</span>
            </div>

            <div className="hud-card-body">
              <div className="hud-log-row">
                <span className="log-time">[00:00.00]</span>
                <span className="log-tag tag-info">SYS_INIT</span>
                <span className="log-msg">Chaos engine initialized on master node</span>
              </div>
              <div className="hud-log-row">
                <span className="log-time">[00:00.12]</span>
                <span className="log-tag tag-success">SUPERVISOR</span>
                <span className="log-msg">Health watchdog active (interval: 3s)</span>
              </div>
              <div className="hud-log-row">
                <span className="log-time">[00:00.28]</span>
                <span className="log-tag tag-warn">RECOVERY</span>
                <span className="log-msg">Self-healing policy: auto-restart</span>
              </div>
              <div className="hud-log-row highlight">
                <span className="log-time">[00:00.35]</span>
                <span className="log-tag tag-accent">GATEWAY</span>
                <span className="log-msg">Awaiting experiment trigger from operator</span>
              </div>
            </div>

            <div className="hud-card-footer">
              <div className="hud-stat-col">
                <span className="stat-label">Blast Radius</span>
                <span className="stat-val">Isolated Container</span>
              </div>
              <div className="hud-stat-col">
                <span className="stat-label">Probe Status</span>
                <span className="stat-val text-emerald">200 OK Active</span>
              </div>
              <div className="hud-stat-col">
                <span className="stat-label">Mode</span>
                <span className="stat-val text-accent">UI Preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          padding-top: calc(var(--nav-height) + 4rem);
          padding-bottom: 5rem;
          min-height: 85vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-cyber-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.6;
        }

        .ambient-spotlight {
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 600px;
          background: radial-gradient(circle, rgba(229, 9, 20, 0.22) 0%, rgba(14, 14, 18, 0) 70%);
          filter: blur(40px);
        }

        .vignette-layer {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 30%, rgba(8, 8, 10, 0.85) 100%);
        }

        .resilience-svg-canvas {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          max-width: 1100px;
          height: auto;
          opacity: 0.55;
        }

        .pulse-path {
          stroke-dasharray: 800;
          stroke-dashoffset: 800;
          animation: drawPath 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes drawPath {
          0% { stroke-dashoffset: 800; opacity: 0.3; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -800; opacity: 0.3; }
        }

        .hero-container {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3.5rem;
          align-items: center;
        }

        @media (min-width: 992px) {
          .hero-container {
            grid-template-columns: 1.15fr 0.85fr;
          }
        }

        .hero-content {
          max-width: 660px;
        }

        .hero-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(229, 9, 20, 0.08);
          border: 1px solid rgba(229, 9, 20, 0.25);
          padding: 0.35rem 0.9rem;
          border-radius: 9999px;
          margin-bottom: 1.75rem;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: #fca5a5;
        }

        .hero-pill-pulse {
          width: 7px;
          height: 7px;
          background: var(--red-primary);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--red-primary);
        }

        .hero-pill-divider {
          color: rgba(255, 255, 255, 0.3);
        }

        .hero-pill-sub {
          color: var(--text-muted);
        }

        .hero-title {
          font-size: clamp(2.75rem, 5.5vw, 4.25rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
        }

        .text-red {
          color: var(--red-primary);
          text-shadow: 0 0 25px rgba(229, 9, 20, 0.4);
        }

        .hero-tagline {
          font-size: clamp(1.2rem, 2.2vw, 1.55rem);
          font-weight: 600;
          line-height: 1.35;
          color: #f1f5f9;
          margin-bottom: 1.2rem;
          font-family: var(--font-display);
        }

        .hero-description {
          font-size: 1.05rem;
          line-height: 1.65;
          color: var(--text-muted);
          margin-bottom: 2.25rem;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1.2rem;
          margin-bottom: 2.5rem;
        }

        .hero-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 1.5rem;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .text-emerald {
          color: #34d399;
        }

        /* HUD Card */
        .hero-hud-card-wrapper {
          position: relative;
        }

        .hero-hud-card {
          border: 1px solid rgba(229, 9, 20, 0.25);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(229, 9, 20, 0.1);
        }

        .hud-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          background: rgba(14, 14, 18, 0.9);
          border-bottom: 1px solid var(--border-subtle);
        }

        .terminal-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot-red { background: #ef4444; }
        .dot-amber { background: #f59e0b; }
        .dot-green { background: #10b981; }

        .hud-header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .hud-badge-live {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.08);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .hud-card-body {
          padding: 1.25rem;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: rgba(10, 10, 14, 0.85);
        }

        .hud-log-row {
          display: grid;
          grid-template-columns: 80px 105px 1fr;
          align-items: baseline;
          gap: 0.5rem;
          line-height: 1.4;
        }

        .hud-log-row.highlight {
          background: rgba(229, 9, 20, 0.06);
          padding: 0.35rem 0.5rem;
          border-radius: 4px;
          border-left: 2px solid var(--red-primary);
        }

        .log-time {
          color: var(--text-dim);
          font-size: 0.75rem;
        }

        .log-tag {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.1rem 0.4rem;
          border-radius: 3px;
          text-align: center;
        }

        .tag-info { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .tag-success { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .tag-warn { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .tag-accent { background: rgba(229, 9, 20, 0.2); color: #fca5a5; }

        .log-msg {
          color: #e2e8f0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .hud-card-footer {
          padding: 1rem 1.25rem;
          background: rgba(14, 14, 18, 0.95);
          border-top: 1px solid var(--border-subtle);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .hud-stat-col {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--text-dim);
          font-family: var(--font-mono);
          letter-spacing: 0.05em;
        }

        .stat-val {
          font-size: 0.82rem;
          font-weight: 600;
          font-family: var(--font-mono);
          color: #f1f5f9;
        }

        .stat-val.text-accent {
          color: #ff6b75;
        }
      `}</style>
    </section>
  );
};
