import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Search, 
  Lock, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Layers, 
  Activity, 
  Sliders, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { NavigationEvent, TransitionType, TaskItem, ProductCatalogItem } from '../types';

interface SpaSimulatorProps {
  onNavigationEvent: (event: NavigationEvent) => void;
  activePath: string;
  setActivePath: (path: string) => void;
  historyStack: string[];
  historyIndex: number;
  setHistoryStack: React.Dispatch<React.SetStateAction<string[]>>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  transitionStyle: TransitionType;
  setTransitionStyle: (style: TransitionType) => void;
  latencyMs: number;
  setLatencyMs: (ms: number) => void;
}

const SAMPLE_CATALOG: ProductCatalogItem[] = [
  {
    id: 'router-core',
    name: 'History Router Engine',
    category: 'Router',
    version: 'v2.4.0',
    description: 'Autonomous client-side routing class supporting HTML5 pushState, popstate, query parsing, and lifecycle hooks.',
    stars: 342,
    tags: ['pushState', 'popstate', 'regex-match'],
    specs: { bundleSize: '1.4 KB', dependencies: 0, lifecycleHooks: ['beforeRoute', 'render', 'afterRoute'] }
  },
  {
    id: 'state-pubsub',
    name: 'Observable State Store',
    category: 'State',
    version: 'v1.8.2',
    description: 'Zero-dependency reactive store that keeps state alive in memory across dynamic DOM view destruction and recreation.',
    stars: 289,
    tags: ['pub-sub', 'reactive', 'in-memory'],
    specs: { bundleSize: '0.8 KB', dependencies: 0, lifecycleHooks: ['subscribe', 'update', 'notify'] }
  },
  {
    id: 'transition-animator',
    name: 'CSS Keyframe Transitions',
    category: 'Animation',
    version: 'v3.1.0',
    description: 'Hardware-accelerated transforms (transform, opacity) eliminating layout thrashing and delivering 60 FPS view switching.',
    stars: 412,
    tags: ['60fps', 'compositor', 'cubic-bezier'],
    specs: { bundleSize: '0.9 KB', dependencies: 0, lifecycleHooks: ['enter', 'enterActive', 'exit'] }
  },
  {
    id: 'aria-announcer',
    name: 'Accessible Route Announcer',
    category: 'Tooling',
    version: 'v1.0.4',
    description: 'ARIA live region (polite) that automatically informs screen readers when a client-side navigation occurs without a page reload.',
    stars: 194,
    tags: ['a11y', 'wcag-aa', 'aria-live'],
    specs: { bundleSize: '0.3 KB', dependencies: 0, lifecycleHooks: ['announce', 'clear'] }
  },
  {
    id: 'dom-renderer',
    name: 'Template Interpolator',
    category: 'Tooling',
    version: 'v2.0.1',
    description: 'Lightweight template-literal renderer mapping state trees directly into clean, sanitizable HTML nodes.',
    stars: 256,
    tags: ['dom-diff', 'template-literal', 'sanitization'],
    specs: { bundleSize: '1.1 KB', dependencies: 0, lifecycleHooks: ['mount', 'unmount'] }
  }
];

export const SpaSimulator: React.FC<SpaSimulatorProps> = ({
  onNavigationEvent,
  activePath,
  setActivePath,
  historyStack,
  historyIndex,
  setHistoryStack,
  setHistoryIndex,
  transitionStyle,
  setTransitionStyle,
  latencyMs,
  setLatencyMs
}) => {
  // Simulator internal address bar input
  const [addressInput, setAddressInput] = useState(activePath);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<'All' | 'Router' | 'State' | 'Animation' | 'Tooling'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemDetail, setSelectedItemDetail] = useState<ProductCatalogItem | null>(null);

  // In-memory persistent state (Demonstrating SPA state retention across unmounted views!)
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: '1', title: 'Implement History API pushState handlers', priority: 'high', completed: true, createdAt: '10:14 AM' },
    { id: '2', title: 'Configure smooth CSS view exit/enter keyframes', priority: 'medium', completed: true, createdAt: '10:22 AM' },
    { id: '3', title: 'Verify asynchronous data hydration without page reload', priority: 'high', completed: true, createdAt: '10:35 AM' },
    { id: '4', title: 'Audit screen-reader ARIA live announcements', priority: 'low', completed: false, createdAt: '10:48 AM' }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // SPA navigation counters
  const [totalClientNavigations, setTotalClientNavigations] = useState(1);
  const contentMountRef = useRef<HTMLDivElement>(null);

  // Sync addressInput when activePath changes externally
  useEffect(() => {
    setAddressInput(activePath);
  }, [activePath]);

  // Navigate function simulating SPA router pushState
  const navigateTo = async (targetPath: string, pushHistory = true) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const startTime = performance.now();

    // 1. Log pushState or popstate start
    onNavigationEvent({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type: pushHistory ? 'pushState' : 'popstate',
      url: targetPath,
      details: pushHistory 
        ? `window.history.pushState({}, '', '${targetPath}')` 
        : `Restored from popstate: '${targetPath}'`
    });

    // 2. Simulate artificial network latency if configured
    if (latencyMs > 0) {
      onNavigationEvent({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        type: 'async_fetch',
        url: targetPath,
        details: `Fetching view template & mock JSON data (throttle: ${latencyMs}ms)...`,
        latencyMs
      });
      await new Promise(r => setTimeout(r, latencyMs));
    }

    // 3. Update History Stack
    if (pushHistory) {
      const newStack = historyStack.slice(0, historyIndex + 1);
      newStack.push(targetPath);
      setHistoryStack(newStack);
      setHistoryIndex(newStack.length - 1);
    }

    setActivePath(targetPath);
    setAddressInput(targetPath);
    setTotalClientNavigations(prev => prev + 1);

    // 4. Log DOM render event
    const duration = Math.round(performance.now() - startTime);
    onNavigationEvent({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type: targetPath.startsWith('/404') || (!['/', '/catalog', '/state-lab', '/analytics', '/settings'].includes(targetPath.split('?')[0])) 
        ? 'error_404' 
        : 'dom_render',
      url: targetPath,
      details: `DOM node injected into #app-view without document reload (${duration}ms)`,
      latencyMs: duration,
      statusCode: targetPath.startsWith('/404') || (!['/', '/catalog', '/state-lab', '/analytics', '/settings'].includes(targetPath.split('?')[0])) ? 404 : 200
    });

    // Settle transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 220);
  };

  // Back button handler
  const handleBack = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      const target = historyStack[nextIndex];
      navigateTo(target, false);
    }
  };

  // Forward button handler
  const handleForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      const target = historyStack[nextIndex];
      navigateTo(target, false);
    }
  };

  // Reload handler (demonstrating state preservation)
  const handleReload = () => {
    navigateTo(activePath, false);
  };

  // Address bar submit
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = addressInput.trim();
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    navigateTo(url, true);
  };

  // Task actions in State Lab
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      completed: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Filter catalog items
  const filteredCatalog = SAMPLE_CATALOG.filter(item => {
    const matchesCat = selectedCatalogCategory === 'All' || item.category === selectedCatalogCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Determine which sub-view to render
  const baseRoute = activePath.split('?')[0];

  const getTransitionClass = () => {
    if (!isTransitioning) return '';
    switch (transitionStyle) {
      case 'slide': return 'spa-slide-enter spa-slide-enter-active';
      case 'zoom': return 'spa-zoom-enter spa-zoom-enter-active';
      case 'fade':
      default: return 'spa-fade-enter spa-fade-enter-active';
    }
  };

  return (
    <div className="space-y-4">
      {/* Simulation Controls & Diagnostics Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Interactive SPA Browser Environment
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click navigation links, test Back/Forward buttons, or simulate artificial network conditions.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Transition Style Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Transition:</span>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                {(['fade', 'slide', 'zoom'] as TransitionType[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setTransitionStyle(style)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                      transitionStyle === style
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Latency Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Simulated Latency:</span>
              <select
                value={latencyMs}
                onChange={(e) => setLatencyMs(Number(e.target.value))}
                aria-label="Simulated Latency"
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value={0}>0ms (Instant)</option>
                <option value={200}>200ms (Fast 4G)</option>
                <option value={600}>600ms (Slow 3G)</option>
                <option value={1200}>1200ms (High Latency)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Browser Window Frame */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden flex flex-col min-h-[640px]">
        {/* Browser Top Navigation Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-3">
          {/* OS Window Traffic Lights */}
          <div className="flex items-center gap-1.5 shrink-0 pr-2">
            <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/20 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/20 inline-block"></span>
          </div>

          {/* Browser Back / Forward / Reload Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleBack}
              disabled={historyIndex <= 0 || isTransitioning}
              title="History Back"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleForward}
              disabled={historyIndex >= historyStack.length - 1 || isTransitioning}
              title="History Forward"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleReload}
              disabled={isTransitioning}
              title="Reload Route (State Preserved)"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isTransitioning ? 'animate-spin text-sky-600' : ''}`} />
            </button>
          </div>

          {/* Simulated Browser Address Bar */}
          <form onSubmit={handleAddressSubmit} className="flex-1 flex items-center">
            <div className="w-full flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 shadow-2xs focus-within:ring-2 focus-within:ring-sky-500/30 focus-within:border-sky-500 transition-all">
              <Lock className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
              <span className="text-slate-400 select-none mr-0.5">https://app.spa.local</span>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="/route"
                className="flex-1 bg-transparent font-mono text-slate-900 outline-none"
              />
              <span className="text-[10px] text-slate-400 ml-2 hidden sm:inline select-none">Press Enter to navigate</span>
            </div>
          </form>

          {/* Quick Route Shortcuts */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-slate-500 shrink-0">
            <button
              onClick={() => navigateTo('/unknown-404-test')}
              className="px-2 py-1 bg-slate-200/70 hover:bg-slate-200 rounded text-slate-700 transition-colors cursor-pointer"
              title="Trigger 404 Route"
            >
              Test 404
            </button>
          </div>
        </div>

        {/* Embedded Single Page Application Viewport */}
        <div className="flex-1 flex flex-col bg-slate-50 relative">
          {/* Top Bar of the Embedded SPA */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-6">
              {/* Brand Link (Navigates to / without full page reload) */}
              <button
                onClick={() => navigateTo('/')}
                className="flex items-center gap-2 text-slate-900 font-bold text-base hover:opacity-80 transition-opacity text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                  ◆
                </div>
                <span>PulseSPA</span>
              </button>

              {/* SPA Dynamic Nav Links with active indicators */}
              <nav className="flex items-center gap-1 text-xs font-medium">
                {[
                  { path: '/', label: 'Overview' },
                  { path: '/catalog', label: 'Catalog' },
                  { path: '/state-lab', label: 'State Lab', count: tasks.filter(t => !t.completed).length },
                  { path: '/analytics', label: 'Telemetry' },
                  { path: '/settings', label: 'Preferences' }
                ].map((item) => {
                  const isActive = baseRoute === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigateTo(item.path)}
                      className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-slate-100 text-sky-700 font-semibold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {typeof item.count === 'number' && item.count > 0 && (
                        <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-1.5 py-0.2 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Embedded Shell State Badges */}
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <span className="text-slate-500">
                  Navigations: <strong className="text-slate-800 font-mono">{totalClientNavigations}</strong>
                </span>
              </div>
            </div>
          </header>

          {/* Active View Container (#app-view mount point) */}
          <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6" ref={contentMountRef}>
            <div className={`transition-all duration-200 ${getTransitionClass()}`}>
              {/* VIEW 1: Overview */}
              {baseRoute === '/' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                      Single Page Application Overview
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                      Dynamic content hydration and browser history orchestration without page refreshes.
                    </p>
                  </div>

                  {/* Overview Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Client Navigations
                      </div>
                      <div className="text-3xl font-bold text-sky-600 mt-1 font-mono">
                        {totalClientNavigations}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Zero HTTP page reloads</div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        In-Memory State Store
                      </div>
                      <div className="text-3xl font-bold text-emerald-600 mt-1 font-mono">
                        {tasks.filter(t => t.completed).length} / {tasks.length}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Tasks persistent across views</div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Active Transition
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mt-1 capitalize font-mono">
                        {transitionStyle}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Hardware-accelerated CSS</div>
                    </div>
                  </div>

                  {/* Architecture Mechanism Walkthrough */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                    <h2 className="text-base font-bold text-slate-900 mb-3">
                      How This SPA Architecture Operates
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                        <div className="w-7 h-7 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs mb-2">
                          1
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 mb-1">
                          Anchor Click Interception
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Anchor clicks are intercepted via <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono">e.preventDefault()</code>. Default document reload is halted while preserving browser memory.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                        <div className="w-7 h-7 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs mb-2">
                          2
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 mb-1">
                          HTML5 History Synchronization
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          The client router executes <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono">history.pushState()</code>, keeping browser address, bookmarking, and forward/back stacks perfectly synchronized.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                        <div className="w-7 h-7 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs mb-2">
                          3
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 mb-1">
                          Scoped Dynamic Mounting
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Only the target container <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono">#app-view</code> is unmounted and replaced. Headers, navigation, and global stores remain continuous.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Ready to test state persistence across routes?
                      </span>
                      <button
                        onClick={() => navigateTo('/state-lab')}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Explore State Lab →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: Dynamic Catalog & Query Routing */}
              {baseRoute === '/catalog' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Component Catalog
                      </h1>
                      <p className="text-sm text-slate-600 mt-1">
                        Demonstrating dynamic asynchronous data fetching and query string state management.
                      </p>
                    </div>

                    {/* Category Filter Buttons */}
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                      {(['All', 'Router', 'State', 'Animation', 'Tooling'] as const).map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCatalogCategory(cat);
                            const newUrl = cat === 'All' ? '/catalog' : `/catalog?category=${cat}`;
                            navigateTo(newUrl, true);
                          }}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                            selectedCatalogCategory === cat
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search and count bar */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-2xs">
                    <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search component catalog by name or tag..."
                      className="flex-1 bg-transparent text-xs text-slate-900 outline-none"
                    />
                    <span className="text-xs text-slate-400 font-mono pr-2">
                      {filteredCatalog.length} of {SAMPLE_CATALOG.length} items
                    </span>
                  </div>

                  {/* Catalog Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCatalog.map(item => (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                <span>{item.category}</span>
                                <span>·</span>
                                <span className="font-mono">{item.version}</span>
                                <span>·</span>
                                <span className="font-mono text-emerald-600">{item.specs.bundleSize}</span>
                              </div>
                            </div>
                            <span className="text-xs font-mono font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              ★ {item.stars}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            {item.description}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {item.tags.map(tag => (
                              <span key={tag} className="text-[10px] font-mono bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-mono">
                            Deps: {item.specs.dependencies}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedItemDetail(item);
                              navigateTo(`/catalog?item=${item.id}`, true);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors cursor-pointer"
                          >
                            Inspect Specs
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detail Modal / Drawer Simulation */}
                  {selectedItemDetail && (
                    <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-sky-950">Deep Link Inspection: {selectedItemDetail.name}</span>
                          <span className="text-xs font-mono text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                            /catalog?item={selectedItemDetail.id}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedItemDetail(null);
                            navigateTo('/catalog', true);
                          }}
                          className="text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          Close ×
                        </button>
                      </div>
                      <p className="text-xs text-sky-900 mb-2">{selectedItemDetail.description}</p>
                      <div className="text-xs text-sky-800 flex items-center gap-4 font-mono">
                        <span>Bundle: {selectedItemDetail.specs.bundleSize}</span>
                        <span>Hooks: {selectedItemDetail.specs.lifecycleHooks.join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 3: Interactive State Lab (State Persistence across routes) */}
              {baseRoute === '/state-lab' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                      Interactive State Lab
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                      Prove that in-memory variables and state persist seamlessly when switching between unmounted SPA views.
                    </p>
                  </div>

                  {/* State Proof Callout */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-950 leading-relaxed">
                      <strong>State Persistence Verification:</strong> Add or check off tasks below. Then navigate to <em>Overview</em> or <em>Catalog</em> and return here. In a multi-page app (MPA), all data would vanish without a database request; in this SPA, all mutations remain live in memory.
                    </div>
                  </div>

                  {/* Add Task Form */}
                  <form onSubmit={handleAddTask} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Enter a new persistent state item..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:ring-1 focus:ring-sky-500"
                    />

                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                      aria-label="Priority"
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 outline-none"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>

                    <button
                      type="submit"
                      disabled={!newTaskTitle.trim()}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Commit to State</span>
                    </button>
                  </form>

                  {/* Tasks List */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-2xs divide-y divide-slate-100 overflow-hidden">
                    <div className="p-3 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>In-Memory State Registry ({tasks.length} items)</span>
                      <span>{tasks.filter(t => t.completed).length} completed</span>
                    </div>

                    {tasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                          task.completed ? 'bg-slate-50/50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id)}
                            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                          />
                          <span className={`text-xs font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {task.title}
                          </span>
                        </label>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-medium ${
                            task.priority === 'high' ? 'bg-rose-50 text-rose-700' :
                            task.priority === 'medium' ? 'bg-amber-50 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">{task.createdAt}</span>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 4: Telemetry & Invariants Comparison */}
              {baseRoute === '/analytics' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                      Runtime Telemetry &amp; Invariants
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                      Architectural performance comparison between Single Page Applications and Multi-Page reloads.
                    </p>
                  </div>

                  {/* Architecture Comparison Table */}
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                          <th className="py-3 px-4">Evaluation Dimension</th>
                          <th className="py-3 px-4">Single Page Application (SPA)</th>
                          <th className="py-3 px-4">Multi-Page Architecture (MPA)</th>
                          <th className="py-3 px-4">Delta Benefit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">DOM Re-parsing</td>
                          <td className="py-3 px-4 text-emerald-700 font-medium">None (Scoped element mount)</td>
                          <td className="py-3 px-4 text-rose-700">100% full document cycle</td>
                          <td className="py-3 px-4 font-mono text-slate-600">Eliminates blank white flash</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">Payload per Navigation</td>
                          <td className="py-3 px-4 text-emerald-700 font-medium">~1.2 KB (JSON data delta)</td>
                          <td className="py-3 px-4 text-rose-700">~180 KB (HTML + CSS + Scripts)</td>
                          <td className="py-3 px-4 font-mono text-slate-600">&gt; 95% bandwidth reduction</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">Transition Continuity</td>
                          <td className="py-3 px-4 text-emerald-700 font-medium">60 FPS Hardware-accelerated CSS</td>
                          <td className="py-3 px-4 text-rose-700">Hard refresh page interrupt</td>
                          <td className="py-3 px-4 font-mono text-slate-600">Sub-200ms perceptual speed</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">State Retention</td>
                          <td className="py-3 px-4 text-emerald-700 font-medium">Preserved in JS memory store</td>
                          <td className="py-3 px-4 text-rose-700">Lost on navigation</td>
                          <td className="py-3 px-4 font-mono text-slate-600">Zero database churn for UI state</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-slate-900">History Stack</td>
                          <td className="py-3 px-4 text-emerald-700 font-medium">Native pushState &amp; popstate</td>
                          <td className="py-3 px-4 text-slate-700">Browser document stack</td>
                          <td className="py-3 px-4 font-mono text-slate-600">Full Back/Forward fidelity</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Real-time Browser Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <div className="text-xs text-slate-500 font-medium">History Stack Depth</div>
                      <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                        {historyIndex + 1} <span className="text-xs text-slate-400 font-normal">of {historyStack.length}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">Managed via window.history</div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <div className="text-xs text-slate-500 font-medium">DOM Scope Target</div>
                      <div className="text-2xl font-bold font-mono text-sky-600 mt-1">#app-view</div>
                      <div className="text-[11px] text-slate-500 mt-1">Header &amp; Footer stay mounted</div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <div className="text-xs text-slate-500 font-medium">Transition Easing</div>
                      <div className="text-sm font-bold font-mono text-slate-900 mt-2 truncate">
                        cubic-bezier(0.16, 1, 0.3, 1)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">Optimal settling curve</div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 5: Application Preferences */}
              {baseRoute === '/settings' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                      Application Preferences
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                      Tune client-side animation parameters and configure the simulation environment.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                    <h2 className="text-sm font-bold text-slate-900">View Transition Animation Mode</h2>
                    <p className="text-xs text-slate-500">
                      Select which CSS transition curve is applied when the router swaps content in the DOM.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['fade', 'slide', 'zoom'] as const).map(style => (
                        <button
                          key={style}
                          onClick={() => setTransitionStyle(style)}
                          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                            transitionStyle === style
                              ? 'border-sky-600 bg-sky-50/50 ring-1 ring-sky-600'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-900 capitalize">{style} Transition</div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            {style === 'fade' && 'Subtle opacity crossfade with 6px vertical settling.'}
                            {style === 'slide' && 'Smooth horizontal 18px translation for hierarchical views.'}
                            {style === 'zoom' && 'Micro scale settling from 0.97 to 1.0.'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                    <h2 className="text-sm font-bold text-slate-900">State Reset &amp; Diagnostics</h2>
                    <p className="text-xs text-slate-500">
                      Flush in-memory task registry or reset history stack counters.
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setTasks([]);
                        }}
                        className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Clear State Registry
                      </button>
                      <button
                        onClick={() => {
                          setTotalClientNavigations(1);
                        }}
                        className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Reset Navigation Counter
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 6: 404 Route Not Found Fallback */}
              {!['/', '/catalog', '/state-lab', '/analytics', '/settings'].includes(baseRoute) && (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-lg mx-auto my-8 shadow-2xs">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono">404</div>
                  <h2 className="text-base font-bold text-slate-900 mt-2">Route Not Found</h2>
                  <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
                    The requested client path <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">{activePath}</code> was intercepted by the router, but does not match any route definition in the routing table.
                  </p>
                  <button
                    onClick={() => navigateTo('/')}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* Embedded SPA Footer */}
          <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-2.5 text-[11px] text-slate-500 flex items-center justify-between">
            <div>PulseSPA Simulation · Zero Full Page Reloads</div>
            <div className="flex items-center gap-2 font-mono">
              <span>Active Route: {activePath}</span>
              <span>·</span>
              <span>DOM Hydrated: OK</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
