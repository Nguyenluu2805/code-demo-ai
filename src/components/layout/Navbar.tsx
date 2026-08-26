import React from 'react';
import { DownloadIcon } from '../common/Icons';
import { ScriptCodeLogo } from '../common/ScriptCodeLogo';

interface NavbarProps {
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenExportModal }) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <ScriptCodeLogo size="md" />

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Export Video Button */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 border border-white/10 transition-all active:scale-95 cursor-pointer"
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            <span>Xuất Video & Kịch bản</span>
          </button>
        </div>
      </div>
    </header>
  );
};
