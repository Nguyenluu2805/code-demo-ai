import React from 'react';
import { THEME_CONFIGS, EditorTheme } from '../../types';
import { GitBranch, ChevronRight } from 'lucide-react';
import { FileIcon } from './FileIcon';

interface WindowChromeProps {
  theme: EditorTheme;
  filename?: string;
  isTerminal?: boolean;
  children: React.ReactNode;
}

export const WindowChrome: React.FC<WindowChromeProps> = ({
  theme,
  filename = 'index.ts',
  isTerminal = false,
  children
}) => {
  const cfg = THEME_CONFIGS[theme] || THEME_CONFIGS['one-dark'];
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  return (
    <div
      className="flex flex-col w-full h-full rounded-2xl overflow-hidden shadow-2xl border transition-all duration-300"
      style={{
        backgroundColor: isTerminal ? '#0b0f19' : cfg.editorBg,
        borderColor: cfg.borderColor,
        boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* 1. Title Bar Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b select-none"
        style={{
          backgroundColor: cfg.headerBg,
          borderColor: cfg.borderColor
        }}
      >
        {/* macOS Window Traffic Lights */}
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] shadow-sm flex items-center justify-center cursor-pointer"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] shadow-sm flex items-center justify-center cursor-pointer"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] shadow-sm flex items-center justify-center cursor-pointer"></div>
        </div>

        {/* Tab / Title Header */}
        <div className="flex items-center">
          {isTerminal ? (
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-slate-200 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold">Terminal — zsh</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-t-lg text-xs font-mono font-medium border-t-2 shadow-sm"
              style={{
                backgroundColor: cfg.tabActiveBg,
                color: '#ffffff',
                borderTopColor: cfg.accentColor
              }}
            >
              <FileIcon filename={filename} className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold">{filename}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/80 ml-1"></span>
            </div>
          )}
        </div>

        {/* Right Info */}
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <div className="hidden sm:flex items-center gap-1 opacity-70">
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px]">main</span>
          </div>
        </div>
      </div>

      {/* 2. Breadcrumbs Bar (for Code Editor) */}
      {!isTerminal && (
        <div
          className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-mono border-b select-none opacity-80"
          style={{
            backgroundColor: cfg.editorBg,
            borderColor: 'rgba(255, 255, 255, 0.05)',
            color: cfg.textColor
          }}
        >
          <span className="text-slate-400">project</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-400">src</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="font-medium text-white flex items-center gap-1.5">
            <FileIcon filename={filename} className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{filename}</span>
          </span>
        </div>
      )}

      {/* 3. Main Workspace (Sidebar + Code Area) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sleek Mini Sidebar */}
        {!isTerminal && (
          <div
            className="hidden sm:flex flex-col w-36 border-r p-2 space-y-1 select-none flex-shrink-0"
            style={{
              backgroundColor: cfg.headerBg,
              borderColor: 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
              Explorer
            </div>
            
            {/* Active file item */}
            <div
              className="flex items-center gap-2 px-2 py-1.5 rounded text-xs font-mono font-medium"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff'
              }}
            >
              <FileIcon filename={filename} className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{filename}</span>
            </div>

            {/* Other mock project files */}
            <div className="flex items-center gap-2 px-2 py-1 rounded text-xs font-mono text-slate-400 opacity-60">
              <FileIcon filename="README.md" className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">README.md</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded text-xs font-mono text-slate-400 opacity-60">
              <FileIcon filename="package.json" className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">package.json</span>
            </div>
          </div>
        )}

        {/* Code Content */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </div>

      {/* 4. Status Bar */}
      {!isTerminal && (
        <div
          className="flex items-center justify-between px-3 py-1 text-[11px] font-mono border-t select-none"
          style={{
            backgroundColor: cfg.accentColor,
            borderColor: cfg.borderColor,
            color: '#ffffff'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold">⚡ main*</span>
            <span className="opacity-80">0 errors, 0 warnings</span>
          </div>
          <div className="flex items-center gap-3 opacity-90 text-[10px]">
            <span>UTF-8</span>
            <span>Spaces: 2</span>
            <span>{ext.toUpperCase() || 'CODE'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
