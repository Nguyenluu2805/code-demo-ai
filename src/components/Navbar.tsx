import React from 'react';
import { VideoCameraIcon, KeyIcon, DownloadIcon, SparklesIcon } from './Icons';

interface NavbarProps {
  onOpenApiKeyModal: () => void;
  onOpenExportModal: () => void;
  hasApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenApiKeyModal,
  onOpenExportModal,
  hasApiKey
}) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <VideoCameraIcon className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[15px] sm:text-base tracking-tight text-white">
                AutoCodeDemo
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                AI Studio
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-normal hidden sm:block">
              Nền tảng tự động tạo video demo code & kịch bản thuyết trình AI
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* API Key Status / Config */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              hasApiKey
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-sm'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800/80'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
            <KeyIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{hasApiKey ? 'Gemini AI Live' : 'API Key'}</span>
          </button>

          {/* Export Video Button */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer"
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            <span>Xuất Video & Kịch bản</span>
          </button>
        </div>
      </div>
    </header>
  );
};
