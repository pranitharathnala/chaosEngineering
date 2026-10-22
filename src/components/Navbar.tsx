import React, { useState, useEffect } from 'react';
import { Menu, X, Cpu } from 'lucide-react';

interface NavbarProps {
  systemStatusText?: string;
  isHealthy?: boolean;
  statusState?: 'healthy' | 'loading' | 'error';
}

export const Navbar: React.FC<NavbarProps> = ({
  systemStatusText = 'System Healthy',
  isHealthy: _isHealthy = true,
  statusState = 'healthy',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'System Health', href: '#system-status' },
    { name: 'Metrics', href: '#metrics' },
    { name: 'Experiments', href: '#experiments' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#about-concept' },
  ];

  return (
    <header
      className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}
      role="banner"
    >
      <div className="container nav-container">
        {/* Brand / Logo */}
        <a href="#hero" className="brand-logo" aria-label="ChaosResilience Home">
          <div className="logo-icon-box">
            <Cpu className="logo-svg-icon" size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-primary">CHAOS</span>
            <span className="brand-accent">RESILIENCE</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="nav-link">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* System Status Pill & Action */}
        <div className="nav-actions">
          <div className={`status-pill ${statusState}`} title="Live Resilience Backend Status Indicator">
            <span className={`pulse-indicator-dot ${statusState}`} />
            <span className="status-text">{systemStatusText}</span>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <ul className="mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-drawer-footer">
            <div className={`status-pill full-width ${statusState}`}>
              <span className={`pulse-indicator-dot ${statusState}`} />
              <span>System Status: {systemStatusText}</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--nav-height);
          z-index: 100;
          transition: background-color 0.3s ease, backdrop-filter 0.3s ease, border-bottom 0.3s ease;
          background: rgba(8, 8, 10, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 1px solid transparent;
        }

        .navbar-wrapper.scrolled {
          background: rgba(10, 10, 14, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-subtle);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .logo-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: linear-gradient(135deg, #1c1c24 0%, #101015 100%);
          border: 1px solid var(--red-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--red-primary);
          box-shadow: 0 0 12px var(--red-subtle);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .brand-logo:hover .logo-icon-box {
          transform: scale(1.05);
          border-color: var(--red-primary);
          box-shadow: 0 0 16px var(--red-glow);
        }

        .brand-text {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: 0.04em;
        }

        .brand-primary {
          color: #FFFFFF;
        }

        .brand-accent {
          color: var(--red-primary);
          margin-left: 2px;
        }

        .desktop-nav {
          display: none;
        }

        @media (min-width: 860px) {
          .desktop-nav {
            display: block;
          }
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
        }

        .nav-link {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
          position: relative;
          padding: 0.25rem 0;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: #FFFFFF;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--red-primary);
          transition: width 0.2s ease;
          border-radius: 2px;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #34d399;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .status-pill.loading {
          background: rgba(6, 182, 212, 0.1);
          border-color: rgba(6, 182, 212, 0.3);
          color: #38bdf8;
        }

        .status-pill.error {
          background: rgba(229, 9, 20, 0.12);
          border-color: rgba(229, 9, 20, 0.35);
          color: #fca5a5;
        }

        .pulse-indicator-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--status-healthy);
          position: relative;
        }

        .pulse-indicator-dot.healthy::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: var(--status-healthy);
          opacity: 0.7;
          animation: pulse-ring 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
        }

        .pulse-indicator-dot.loading {
          background: #38bdf8;
        }

        .pulse-indicator-dot.loading::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: #38bdf8;
          opacity: 0.7;
          animation: pulse-ring 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite;
        }

        .pulse-indicator-dot.error {
          background: var(--status-danger);
        }

        .pulse-indicator-dot.error::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: var(--status-danger);
          opacity: 0.7;
          animation: pulse-ring 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite;
        }

        .mobile-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          padding: 0.4rem;
          border-radius: 6px;
        }

        @media (min-width: 860px) {
          .mobile-toggle-btn {
            display: none;
          }
        }

        .mobile-drawer {
          position: fixed;
          top: var(--nav-height);
          left: 0;
          right: 0;
          background: rgba(12, 12, 16, 0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mobile-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-nav-link {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-main);
          display: block;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .status-pill.full-width {
          width: 100%;
          justify-content: center;
        }
      `}</style>
    </header>
  );
};
