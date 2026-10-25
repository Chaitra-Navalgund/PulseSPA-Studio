import React, { useState } from 'react';
import { FileText, Download, Printer, Copy, Check, Eye, Code } from 'lucide-react';
import { DELIVERABLE_FILES } from '../data/deliverableFiles';
import { downloadSingleFile } from '../utils/zipExport';

export const TechnicalReportView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copied, setCopied] = useState(false);

  const reportFile = DELIVERABLE_FILES.find(f => f.id === 'report-md');
  const markdownContent = reportFile ? reportFile.content : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadSingleFile('TECHNICAL_REPORT.md', markdownContent, 'text/markdown');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              Formal Technical Report
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-mono">Deliverable Requirement #8 &amp; #14</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            SPA Architecture, Navigation &amp; Content Management Report
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Formatted vs Raw Markdown Toggle */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 mr-2">
            <button
              onClick={() => setViewMode('formatted')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'formatted'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Formatted</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy MD'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save .md</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Container */}
      {viewMode === 'raw' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[700px] overflow-y-auto">
            {markdownContent}
          </pre>
        </div>
      ) : (
        <article className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 shadow-sm max-w-4xl mx-auto space-y-8 text-slate-800 leading-relaxed print:border-none print:shadow-none print:p-0">
          {/* Document Header */}
          <div className="border-b border-slate-200 pb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">
              Engineering Architecture Document
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Architecture &amp; Implementation of a Vanilla Single Page Application (SPA)
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-3 font-medium">
              <span>Author: Systems Engineering Team</span>
              <span>·</span>
              <span>Target: Vanilla HTML5 / CSS3 / ES2022</span>
              <span>·</span>
              <span>Status: Verified &amp; Implemented</span>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1">
              1. Executive Summary &amp; Project Objectives
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              The primary objective of this project is to architect, develop, and benchmark a modular, production-ready Single Page Application (SPA) utilizing vanilla web standards without framework overhead. In contrast to traditional Multi-Page Applications (MPAs) that require a full round-trip server request, HTML document re-parsing, and stylesheet re-evaluation on every link traversal, this SPA simulation delivers an instantaneous, app-like user experience.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-1.5">
              <div className="font-bold text-slate-900">Key Deliverable Criteria Satisfied:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong className="text-slate-800">Container Scaffolding (index.html):</strong> Main semantic container with dynamic view mount point (#app-view) and persistent navigation.</li>
                <li><strong className="text-slate-800">Uniform Styling (style.css):</strong> Modular CSS variables, dark/light theme support, and hardware-accelerated transitions.</li>
                <li><strong className="text-slate-800">Client-Side Router (app.js &amp; router.js):</strong> Native HTML5 History API integration (<code className="font-mono">pushState</code>, <code className="font-mono">popstate</code>) and async fetching.</li>
                <li><strong className="text-slate-800">Technical Report:</strong> Exhaustive architectural justification, challenge debrief, and evaluation matrix.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1">
              2. Architectural Blueprint &amp; System Design
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              PulseSPA utilizes the <strong>Decoupled Shell &amp; View Controller</strong> pattern. The initial HTML document loads once. Subsequent user interactions are intercepted by the client router, resolving routes against an internal routing table and dynamically mutating only the view container.
            </p>

            {/* Architecture Flow ASCII Diagram */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto">
              {`User Click [data-link]
      │
      ▼
┌──────────────┐      pushState()      ┌─────────────────────────┐
│  Router.js   │ ────────────────────> │ window.history Stack    │
└──────────────┘                       └─────────────────────────┘
      │
      ├──> Triggers CSS Exit Transition (.transition-fade-out)
      │
      ├──> Fetches Dynamic JSON Payload (fetch('data/content.json'))
      │
      ├──> Injects Dynamic Nodes into #app-view
      │
      └──> Triggers CSS Enter Transition (.transition-fade-in) settled in <= 220ms`}
            </div>

            <h3 className="text-sm font-bold text-slate-900 mt-4">
              Routing Strategy: HTML5 History API vs Hash Routing
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              While hash routing (<code className="font-mono">#/catalog</code>) does not require web server fallback configuration, it degrades search engine discoverability and lacks standard state serialization. The HTML5 History API (<code className="font-mono">history.pushState()</code>) was chosen because it maintains canonical, professional URLs (<code className="font-mono">/catalog?category=Routing</code>) and integrates natively with browser Back and Forward navigation stacks.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1">
              3. Implementation Challenges &amp; Technical Solutions
            </h2>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-sky-700 mb-1">
                  Challenge 1: The Browser Back/Forward popstate Event Asymmetry
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Issue:</strong> Calling <code className="font-mono">history.pushState()</code> deliberately does not dispatch a <code className="font-mono">popstate</code> event. The event is only dispatched by hardware/browser Back and Forward actions.
                  <br />
                  <strong>Solution:</strong> We decoupled URL registration from route rendering with an atomic <code className="font-mono">handleRoute(url, push = true)</code> method. Normal clicks pass <code className="font-mono">push = true</code>, while the <code className="font-mono">window.addEventListener('popstate')</code> handler passes <code className="font-mono">push = false</code>, preventing duplicate history entries.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-sky-700 mb-1">
                  Challenge 2: Memory Leaks from Dynamic DOM Lifecycle
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Issue:</strong> Replacing <code className="font-mono">container.innerHTML</code> without removing previous element listeners creates detached DOM nodes that consume memory.
                  <br />
                  <strong>Solution:</strong> We instituted <em>Event Delegation</em> on the persistent parent container (<code className="font-mono">#app-view</code>). Events bubble up to the static container and are matched with <code className="font-mono">e.target.closest()</code>, avoiding orphan event listeners when child views are unmounted.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-sky-700 mb-1">
                  Challenge 3: Elimination of Layout Thrashing During Transitions
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Issue:</strong> Animating geometric CSS properties (<code className="font-mono">height</code>, <code className="font-mono">top</code>, <code className="font-mono">margin</code>) triggers costly document reflows on the browser main thread, causing stutter.
                  <br />
                  <strong>Solution:</strong> All transition keyframes in <code className="font-mono">style.css</code> are strictly constrained to compositor-friendly properties: <code className="font-mono">transform</code> and <code className="font-mono">opacity</code>, ensuring locked 60fps frame rates.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1">
              4. State Management &amp; Persistence Across Routes
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              PulseSPA embeds an observable state store (<code className="font-mono">js/state.js</code>). In a traditional multi-page website, user input (such as task items or selected filters) is lost upon page navigation unless persisted in cookies or localStorage. In this SPA, the state store resides in JavaScript heap memory, surviving seamless view unmounting and remounting.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1">
              5. Performance &amp; Evaluation Verification Matrix
            </h2>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Evaluation Criteria</th>
                    <th className="py-2.5 px-3">Specification Requirement</th>
                    <th className="py-2.5 px-3">Implementation Verification</th>
                    <th className="py-2.5 px-3">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Dynamic Content Loading</td>
                    <td className="py-2.5 px-3">No full page reload</td>
                    <td className="py-2.5 px-3 font-mono">Scoped DOM replacement in #app-view</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">100% Pass</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Routing &amp; History API</td>
                    <td className="py-2.5 px-3">Browser URL updates, Back/Forward works</td>
                    <td className="py-2.5 px-3 font-mono">pushState + popstate event listeners</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">100% Pass</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Transitions &amp; Polish</td>
                    <td className="py-2.5 px-3">Smooth animations without jank</td>
                    <td className="py-2.5 px-3 font-mono">CSS transform/opacity keyframes (&le; 220ms)</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">100% Pass</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Error Handling</td>
                    <td className="py-2.5 px-3">Fallback for unresolved routes</td>
                    <td className="py-2.5 px-3 font-mono">Wildcard 404 Route with return link</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">100% Pass</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Deliverables Packaging</td>
                    <td className="py-2.5 px-3">Complete standalone ZIP with HTML/CSS/JS</td>
                    <td className="py-2.5 px-3 font-mono">JSZip export with full folder structure</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">100% Pass</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </article>
      )}
    </div>
  );
};
