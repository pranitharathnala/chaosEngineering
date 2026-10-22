import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SystemStatus } from './components/SystemStatus';
import { MetricsSection } from './components/MetricsSection';
import { ExperimentsSection } from './components/ExperimentsSection';
import { RecentExperimentsTable } from './components/RecentExperimentsTable';
import { WorkflowSection } from './components/WorkflowSection';
import { EducationalSection } from './components/EducationalSection';
import { Footer } from './components/Footer';

import {
  INITIAL_SYSTEM_STATUS,
  BACKEND_UNAVAILABLE_STATUS,
  INITIAL_METRICS,
  CHAOS_EXPERIMENTS,
  INITIAL_EXPERIMENT_HISTORY,
} from './services/apiPlaceholder';
import { apiService } from './services/apiService';
import type { CurrentExperimentData } from './types/chaos';

export const App: React.FC = () => {
  const [status, setStatus] = useState(INITIAL_SYSTEM_STATUS);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [experiments] = useState(CHAOS_EXPERIMENTS);
  const [history, setHistory] = useState(INITIAL_EXPERIMENT_HISTORY);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentExperiment, setCurrentExperiment] = useState<CurrentExperimentData | null>(null);

  // Fetch real telemetry from backend APIs
  const fetchTelemetry = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [data, currExp] = await Promise.all([
        apiService.fetchAllTelemetry(),
        apiService.getCurrentExperiment().catch(() => null),
      ]);
      setStatus(data.status);
      setMetrics(data.metrics);
      setHistory(data.history);
      if (currExp) {
        setCurrentExperiment(currExp);
      }
    } catch {
      // Backend unavailable: update state truthfully without fabricating fake data
      setStatus(BACKEND_UNAVAILABLE_STATUS);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Poll backend telemetry on mount and standard 5s interval
  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  // Fast polling loop during active chaos experiments (600ms)
  useEffect(() => {
    if (!currentExperiment?.active) return;
    const pollTimer = setInterval(async () => {
      try {
        const [curr, tele] = await Promise.all([
          apiService.getCurrentExperiment(),
          apiService.fetchAllTelemetry().catch(() => null),
        ]);
        setCurrentExperiment(curr);
        if (tele) {
          setStatus(tele.status);
          setMetrics(tele.metrics);
          setHistory(tele.history);
        }
        if (!curr.active) {
          // Final refresh upon experiment completion
          fetchTelemetry();
        }
      } catch (e) {
        console.warn("Telemetry polling warning during experiment:", e);
      }
    }, 600);
    return () => clearInterval(pollTimer);
  }, [currentExperiment?.active, fetchTelemetry]);

  const handleTriggerExperiment = async (type: 'stop' | 'kill') => {
    setIsExecuting(true);
    try {
      await apiService.triggerExperiment(type);
      const curr = await apiService.getCurrentExperiment();
      setCurrentExperiment(curr);
      await fetchTelemetry();
    } catch (err: unknown) {
      console.error("Experiment trigger failed:", err);
      throw err;
    } finally {
      setIsExecuting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine Navbar status indicator text and visual state
  const getNavStatusProps = () => {
    if (status.connectionState === 'loading') {
      return {
        text: 'Connecting to resilience backend...',
        state: 'loading' as const,
        isHealthy: false,
      };
    }
    if (status.connectionState === 'error' || !status.isBackendConnected) {
      return {
        text: 'Backend unavailable',
        state: 'error' as const,
        isHealthy: false,
      };
    }
    if (currentExperiment?.active) {
      if (currentExperiment.state === 'FAILURE_DETECTED' || currentExperiment.state === 'RUNNING') {
        return {
          text: 'Failure Detected',
          state: 'error' as const,
          isHealthy: false,
        };
      }
      if (currentExperiment.state === 'RECOVERING') {
        return {
          text: 'Recovering Container...',
          state: 'loading' as const,
          isHealthy: false,
        };
      }
    }
    if (status.applicationStatus === 'HEALTHY') {
      return {
        text: 'NORMAL (Healthy)',
        state: 'healthy' as const,
        isHealthy: true,
      };
    }
    return {
      text: 'DEGRADED',
      state: 'error' as const,
      isHealthy: false,
    };
  };

  const navStatus = getNavStatusProps();

  return (
    <div className="chaos-app">
      {/* 1. Navigation Bar */}
      <Navbar
        systemStatusText={navStatus.text}
        statusState={navStatus.state}
        isHealthy={navStatus.isHealthy}
      />

      <main>
        {/* 2. Cinematic Hero Section */}
        <Hero
          onViewHealth={() => scrollToSection('system-status')}
          onExploreExperiments={() => scrollToSection('experiments')}
        />

        {/* 3. Live System Status */}
        <SystemStatus
          status={status}
          onRefresh={fetchTelemetry}
          isRefreshing={isRefreshing}
          currentExperiment={currentExperiment}
        />

        {/* 4. Resilience Metrics */}
        <MetricsSection metrics={metrics} />

        {/* 5. Chaos Experiments */}
        <ExperimentsSection
          experiments={experiments}
          onTriggerExperiment={handleTriggerExperiment}
          isExecuting={isExecuting || !!currentExperiment?.active}
          currentExperiment={currentExperiment}
        />

        {/* 6. Recent Experiments */}
        <RecentExperimentsTable records={history} />

        {/* 7. How It Works (Resilience Loop) */}
        <WorkflowSection />

        {/* 8. Netflix Resilience Concept */}
        <EducationalSection />
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
};

export default App;
