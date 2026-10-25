import React from 'react';
import { Download } from 'lucide-react';
import { downloadDeliverablesZip } from '../utils/zipExport';

interface TopNavProps {
  activeTab: 'simulator' | 'inspector' | 'deliverables' | 'report' | 'tests';
  onSelectTab: (tab: 'simulator' | 'inspector' | 'deliverables' | 'report' | 'tests') => void;
  downloadingZip: boolean;
  setDownloadingZip: (val: boolean) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  downloadingZip,
  setDownloadingZip
}) => {
  const handleZipDownload = async () => {
    try {
      setDownloadingZip(true);
      await downloadDeliverablesZip();
    } catch (err) {
      console.error('Failed to generate ZIP archive', err);
    } finally {
      setTimeout(() => setDownloadingZip(false), 600);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line text element) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            ◆
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            PulseSPA Studio
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('simulator')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'simulator'
                ? 'bg-slate-100 text-sky-700 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            SPA Simulator
          </button>

          <button
            onClick={() => onSelectTab('inspector')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'inspector'
                ? 'bg-slate-100 text-sky-700 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            History Inspector
          </button>

          <button
            onClick={() => onSelectTab('deliverables')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'deliverables'
                ? 'bg-slate-100 text-sky-700 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Source Files
          </button>

          <button
            onClick={() => onSelectTab('report')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'report'
                ? 'bg-slate-100 text-sky-700 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Technical Report
          </button>

          <button
            onClick={() => onSelectTab('tests')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'tests'
                ? 'bg-slate-100 text-sky-700 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Verification Suite
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            onClick={handleZipDownload}
            disabled={downloadingZip}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-98 transition-all whitespace-nowrap shadow-sm disabled:opacity-60 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingZip ? 'Packaging ZIP...' : 'Download Project ZIP'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
