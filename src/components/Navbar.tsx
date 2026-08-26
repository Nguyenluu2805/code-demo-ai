import React from 'react';
import { VideoCameraIcon, DownloadIcon } from './Icons';

interface NavbarProps {
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenExportModal
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
          {/* Export Video Button */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer"
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            <span>Xuất Video & Kịch bản</span>
          </button>
        </div>
      </div>
    </header>
  );
};
