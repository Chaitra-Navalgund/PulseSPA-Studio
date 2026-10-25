import React, { useState } from 'react';
import { 
  History, 
  Terminal, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Layers, 
  Trash2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { NavigationEvent } from '../types';

interface SpaInternalsInspectorProps {
  events: NavigationEvent[];
  onClearEvents: () => void;
  historyStack: string[];
  historyIndex: number;
  onJumpToHistoryIndex: (index: number) => void;
  activePath: string;
}

export const SpaInternalsInspector: React.FC<SpaInternalsInspectorProps> = ({
  events,
  onClearEvents,
  historyStack,
  historyIndex,
  onJumpToHistoryIndex,
  activePath
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const filteredEvents = events.filter(e => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const handleCopyEvent = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              SPA Routing Engine &amp; History API Diagnostics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time audit log of <code className="font-mono text-slate-800">window.history.pushState()</code>, <code className="font-mono text-slate-800">popstate</code> events, and DOM hydration lifecycles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearEvents}
              disabled={events.length === 0}
              className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log ({events.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: History Stack Visualization (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Browser History Stack
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Depth: {historyStack.length} entries
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              In a vanilla SPA, each entry represents a point in <code className="font-mono text-slate-800">window.history</code>. Click any item to simulate instant browser back/forward jump without document reload.
            </p>

            <div className="space-y-1.5">
              {historyStack.map((route, idx) => {
                const isCurrent = idx === historyIndex;
                return (
                  <button
                    key={`${route}-${idx}`}
                    onClick={() => onJumpToHistoryIndex(idx)}
                    className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between cursor-pointer border ${
                      isCurrent
                        ? 'border-sky-500 bg-sky-50/70 shadow-2xs'
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-5 h-5 rounded text-[11px] font-mono flex items-center justify-center font-semibold ${
                        isCurrent ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className={`font-mono text-xs truncate ${isCurrent ? 'font-bold text-sky-900' : 'text-slate-700'}`}>
                        {route}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isCurrent && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Explainer Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>Why History API over Hash Navigation?</span>
            </div>
            <p className="leading-relaxed">
              Traditional SPAs utilized <code className="font-mono text-slate-800">window.location.hash</code> (<code className="font-mono text-slate-800">#/path</code>). Modern web architecture uses <code className="font-mono text-slate-800">history.pushState()</code> for clean canonical URLs, server-side compatibility, and rich metadata attachments.
            </p>
          </div>
        </div>

        {/* Right Column: Real-time Event Console (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            {/* Filter bar */}
            <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold text-slate-900">Event Stream</span>
              </div>

              <div className="flex items-center gap-1">
                {(['all', 'pushState', 'popstate', 'async_fetch', 'dom_render'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded-md capitalize transition-colors cursor-pointer ${
                      filterType === type
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Event list */}
            <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100 font-mono text-xs">
              {filteredEvents.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-sans">
                  No events logged matching filter. Trigger a navigation in the simulator to view lifecycle logs.
                </div>
              ) : (
                filteredEvents.map((evt, idx) => {
                  const isSuccess = evt.type === 'dom_render' || evt.type === 'pushState' || evt.type === 'popstate';
                  const isError = evt.type === 'error_404';

                  return (
                    <div
                      key={evt.id}
                      onClick={() => handleCopyEvent(evt.details, idx)}
                      className="p-3 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 cursor-pointer group"
                      title="Click to copy log line"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          isError ? 'bg-rose-500' :
                          evt.type === 'async_fetch' ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`} />

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-900 uppercase">
                              [{evt.type}]
                            </span>
                            <span className="text-sky-700 font-semibold truncate">
                              {evt.url}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 mt-0.5 break-all font-sans">
                            {evt.details}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-slate-400">
                          {evt.timestamp}
                        </div>
                        {evt.latencyMs !== undefined && (
                          <div className="text-[10px] text-emerald-600 font-bold">
                            {evt.latencyMs}ms
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedIndex === idx ? 'Copied!' : 'Copy'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
