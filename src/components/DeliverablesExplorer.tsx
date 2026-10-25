import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  FolderTree, 
  FileJson, 
  Layers
} from 'lucide-react';
import { DELIVERABLE_FILES } from '../data/deliverableFiles';
import { downloadSingleFile, downloadDeliverablesZip } from '../utils/zipExport';
import { DeliverableFile } from '../types';

interface DeliverablesExplorerProps {
  onOpenReport: () => void;
}

export const DeliverablesExplorer: React.FC<DeliverablesExplorerProps> = ({ onOpenReport }) => {
  const [selectedFileId, setSelectedFileId] = useState<string>('index-html');
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const activeFile: DeliverableFile = DELIVERABLE_FILES.find(f => f.id === selectedFileId) || DELIVERABLE_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    downloadSingleFile(activeFile.name, activeFile.content);
  };

  const handleDownloadAllZip = async () => {
    try {
      setDownloadingZip(true);
      await downloadDeliverablesZip();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setDownloadingZip(false), 600);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'html': return <FileCode className="w-4 h-4 text-orange-500" />;
      case 'css': return <FileCode className="w-4 h-4 text-sky-500" />;
      case 'js': return <FileCode className="w-4 h-4 text-amber-500" />;
      case 'json': return <FileJson className="w-4 h-4 text-emerald-500" />;
      case 'md':
      default: return <FileText className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Deliverable Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Project Deliverables &amp; Source File Tree
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete vanilla web implementation satisfying the HTML, CSS, JavaScript, and Technical Report criteria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReport}
            className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Read Full Technical Report</span>
          </button>

          <button
            onClick={handleDownloadAllZip}
            disabled={downloadingZip}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingZip ? 'Packaging...' : 'Download Project ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Main Split: File Tree on left, Code Viewer on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Directory List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              <FolderTree className="w-4 h-4 text-slate-600" />
              <span>Project Structure</span>
            </div>

            <div className="space-y-1">
              {DELIVERABLE_FILES.map(file => {
                const isSelected = file.id === selectedFileId;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between cursor-pointer border ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/70 shadow-2xs font-semibold'
                        : 'border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getFileIcon(file.type)}
                      <div className="min-w-0">
                        <div className="font-mono text-xs text-slate-900 truncate">
                          {file.path}
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans truncate">
                          {file.category}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {(file.sizeBytes / 1024).toFixed(1)} KB
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Submission Checklist */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
            <div className="font-bold text-slate-900">Submission Criteria Verified</div>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>HTML main dynamic container (#app-view)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>CSS styling with smooth view transitions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>JavaScript client router &amp; History API</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Comprehensive Technical Report (Markdown)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Standalone ready-to-run ZIP archive</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md flex flex-col">
            {/* Viewer Header */}
            <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sky-400 font-bold">{activeFile.path}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-mono">{(activeFile.sizeBytes / 1024).toFixed(1)} KB</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownloadSingle}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Description strip */}
            <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 text-[11px] text-slate-400">
              {activeFile.description}
            </div>

            {/* Code Content Container */}
            <div className="p-4 overflow-x-auto max-h-[580px] overflow-y-auto">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre font-normal">
                {activeFile.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
