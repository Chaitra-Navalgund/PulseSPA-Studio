import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { SpaSimulator } from './components/SpaSimulator';
import { SpaInternalsInspector } from './components/SpaInternalsInspector';
import { DeliverablesExplorer } from './components/DeliverablesExplorer';
import { TechnicalReportView } from './components/TechnicalReportModal';
import { ValidationSuite } from './components/ValidationSuite';
import { NavigationEvent, TransitionType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'inspector' | 'deliverables' | 'report' | 'tests'>('simulator');
  const [downloadingZip, setDownloadingZip] = useState(false);

  // Shared SPA Router state
  const [activePath, setActivePath] = useState<string>('/');
  const [historyStack, setHistoryStack] = useState<string[]>(['/']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [transitionStyle, setTransitionStyle] = useState<TransitionType>('fade');
  const [latencyMs, setLatencyMs] = useState<number>(0);

  // Navigation and lifecycle event logs
  const [navigationEvents, setNavigationEvents] = useState<NavigationEvent[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'dom_render',
      url: '/',
      details: 'Initial SPA shell hydrated and mounted into #app-view without page reload',
      latencyMs: 12,
      statusCode: 200
    }
  ]);

  const handleNavigationEvent = (event: NavigationEvent) => {
    setNavigationEvents(prev => [event, ...prev]);
  };

  const handleClearEvents = () => {
    setNavigationEvents([]);
  };

  const handleJumpToHistoryIndex = (index: number) => {
    if (index >= 0 && index < historyStack.length) {
      setHistoryIndex(index);
      const targetRoute = historyStack[index];
      setActivePath(targetRoute);
      handleNavigationEvent({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        type: 'popstate',
        url: targetRoute,
        details: `Simulated browser back/forward jump to index ${index} (${targetRoute})`,
        statusCode: 200
      });
      setActiveTab('simulator');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Universal Top Bar adhering to the Top Bar Contract */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        downloadingZip={downloadingZip}
        setDownloadingZip={setDownloadingZip}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'simulator' && (
          <SpaSimulator
            onNavigationEvent={handleNavigationEvent}
            activePath={activePath}
            setActivePath={setActivePath}
            historyStack={historyStack}
            historyIndex={historyIndex}
            setHistoryStack={setHistoryStack}
            setHistoryIndex={setHistoryIndex}
            transitionStyle={transitionStyle}
            setTransitionStyle={setTransitionStyle}
            latencyMs={latencyMs}
            setLatencyMs={setLatencyMs}
          />
        )}

        {activeTab === 'inspector' && (
          <SpaInternalsInspector
            events={navigationEvents}
            onClearEvents={handleClearEvents}
            historyStack={historyStack}
            historyIndex={historyIndex}
            onJumpToHistoryIndex={handleJumpToHistoryIndex}
            activePath={activePath}
          />
        )}

        {activeTab === 'deliverables' && (
          <DeliverablesExplorer
            onOpenReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'report' && (
          <TechnicalReportView />
        )}

        {activeTab === 'tests' && (
          <ValidationSuite />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            PulseSPA Simulation Architecture · Fully Modular HTML, CSS &amp; Vanilla JavaScript
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('deliverables')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Inspect Source Files
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('report')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Technical Report
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('tests')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Verification Suite
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
