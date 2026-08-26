import React from 'react';
import { ScriptCodeLogo } from '../common/ScriptCodeLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl mt-12 py-6">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <ScriptCodeLogo size="sm" showText={false} />
          <span>
            © 2026 <strong className="text-zinc-200">ScriptCode Studio</strong>. Nền tảng tự động sản xuất video demo code chuyên nghiệp.
          </span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Remotion v4.0 Active
          </span>
          <span className="text-zinc-600">•</span>
          <span>Google Gemini AI Engine</span>
        </div>
      </div>
    </footer>
  );
};
