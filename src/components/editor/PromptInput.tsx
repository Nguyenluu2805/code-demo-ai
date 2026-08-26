import React, { useState } from 'react';
import { SparklesIcon, CodeBracketIcon, PaletteIcon, SmartphoneIcon, MonitorIcon, GaugeIcon } from '../common/Icons';
import { FileIcon } from '../../remotion/components/FileIcon';
import { AspectRatio, EditorTheme, SpeedMode, THEME_CONFIGS } from '../../types';

interface PromptInputProps {
  onGenerate: (prompt: string, language: string, theme: EditorTheme, aspectRatio: AspectRatio) => Promise<void>;
  onSelectPreset: (presetKey: string) => void;
  isLoading: boolean;
  currentTheme: EditorTheme;
  currentAspectRatio: AspectRatio;
  currentSpeedMode: SpeedMode;
  onThemeChange: (theme: EditorTheme) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onSpeedModeChange: (speed: SpeedMode) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  onGenerate,
  onSelectPreset,
  isLoading,
  currentTheme,
  currentAspectRatio,
  currentSpeedMode,
  onThemeChange,
  onAspectRatioChange,
  onSpeedModeChange
}) => {
  const [inputMode, setInputMode] = useState<'prompt' | 'code'>('prompt');
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('python');

  const QUICK_PRESETS = [
    { label: 'QuickSort Algorithm', file: 'quicksort.py', key: 'quicksort-python', lang: 'python', text: 'Cài đặt giải thuật sắp xếp nhanh QuickSort bằng Python' },
    { label: 'Binary Search', file: 'binary_search.py', key: 'binary-search', lang: 'python', text: 'Viết thuật toán tìm kiếm nhị phân Binary Search trong Python' },
    { label: 'React useCounter Hook', file: 'useCounter.ts', key: 'react-counter', lang: 'typescript', text: 'Custom hook useCounter tái sử dụng trong React với TypeScript' },
    { label: 'JWT Auth Middleware', file: 'auth.middleware.js', key: 'express-jwt-api', lang: 'javascript', text: 'Viết Middleware xác thực JWT trong Express REST API' },
    { label: 'Fibonacci Dynamic Programming', file: 'fibonacci.py', key: 'fibo', lang: 'python', text: 'Thuật toán tính dãy số Fibonacci tối ưu Memoization' }
  ];

  const handlePresetClick = (preset: typeof QUICK_PRESETS[0]) => {
    setInputText(preset.text);
    setLanguage(preset.lang);
    onSelectPreset(preset.key);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onGenerate(inputText, language, currentTheme, currentAspectRatio);
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all">
      {/* Top Bar: Mode Switcher & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800/80 mb-4">
        {/* Input Mode Selector Tabs */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800/90 shadow-inner">
          <button
            type="button"
            onClick={() => setInputMode('prompt')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              inputMode === 'prompt'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <SparklesIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tạo bằng Prompt / Ý tưởng</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('code')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              inputMode === 'code'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CodeBracketIcon className="w-3.5 h-3.5 text-violet-400" />
            <span>Dán Mã Nguồn có sẵn</span>
          </button>
        </div>
      </div>

      {/* Quick Preset Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 scrollbar-thin">
        <span className="text-[11px] text-zinc-400 whitespace-nowrap font-medium pr-1">Mẫu gợi ý:</span>
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset.key}
            type="button"
            onClick={() => handlePresetClick(preset)}
            className="flex-shrink-0 flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <FileIcon filename={preset.file} className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{preset.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Multi-line Prompt / Code Textarea */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              inputMode === 'prompt'
                ? 'Nhập yêu cầu video bạn muốn tạo (ví dụ: Tạo video demo giải thuật QuickSort trong Python, giải thích chi tiết cách chọn Pivot và in kết quả mảng đã sắp xếp trên Terminal...)'
                : 'Dán đoạn mã nguồn Python, TypeScript, JavaScript của bạn vào đây. Hệ thống sẽ tự động phân tích và tạo kịch bản video gõ từng dòng mượt mà...'
            }
            rows={inputMode === 'code' ? 6 : 3}
            className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all ${
              inputMode === 'code' ? 'font-mono leading-relaxed' : 'leading-relaxed'
            }`}
          />
        </div>

        {/* Toolbar: Parameters & Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Speed Selector (Segmented Pill) */}
            <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-xl p-1">
              <span className="text-[11px] text-zinc-400 pl-2 pr-1 flex items-center gap-1 font-medium">
                <GaugeIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Tốc độ:</span>
              </span>
              <button
                type="button"
                onClick={() => onSpeedModeChange('slow')}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer font-mono ${
                  currentSpeedMode === 'slow'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Rất Chậm (0.5x) - Thích hợp giảng bài chi tiết"
              >
                0.5x Chậm
              </button>
              <button
                type="button"
                onClick={() => onSpeedModeChange('relaxed')}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer font-mono ${
                  currentSpeedMode === 'relaxed'
                    ? 'bg-zinc-800 text-white font-medium border border-zinc-700/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Chậm Vừa (0.75x) - Dễ tiếp thu"
              >
                0.75x
              </button>
              <button
                type="button"
                onClick={() => onSpeedModeChange('normal')}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer font-mono ${
                  currentSpeedMode === 'normal'
                    ? 'bg-zinc-800 text-white font-medium border border-zinc-700/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Chuẩn (1.0x)"
              >
                1.0x Chuẩn
              </button>
            </div>

            {/* Language Selection */}
            <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5">
              <CodeBracketIcon className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="python" className="bg-zinc-900">Python (.py)</option>
                <option value="typescript" className="bg-zinc-900">TypeScript (.ts)</option>
                <option value="javascript" className="bg-zinc-900">JavaScript (.js)</option>
                <option value="tsx" className="bg-zinc-900">React (.tsx)</option>
                <option value="bash" className="bg-zinc-900">Shell (.sh)</option>
              </select>
            </div>

            {/* Theme Selection */}
            <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5">
              <PaletteIcon className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={currentTheme}
                onChange={(e) => onThemeChange(e.target.value as EditorTheme)}
                className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
              >
                {Object.values(THEME_CONFIGS).map((t) => (
                  <option key={t.name} value={t.name} className="bg-zinc-900">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio Selection */}
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1">
              <button
                type="button"
                onClick={() => onAspectRatioChange('16:9')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer font-mono ${
                  currentAspectRatio === '16:9'
                    ? 'bg-zinc-800 text-white font-medium border border-zinc-700/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="16:9 Widescreen (YouTube / Máy tính)"
              >
                <MonitorIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span>16:9</span>
              </button>
              <button
                type="button"
                onClick={() => onAspectRatioChange('9:16')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer font-mono ${
                  currentAspectRatio === '9:16'
                    ? 'bg-zinc-800 text-white font-medium border border-zinc-700/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="9:16 Portrait (TikTok / Shorts / Reels)"
              >
                <SmartphoneIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span>9:16</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-98 cursor-pointer ml-auto"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang tạo video...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4 text-white" />
                <span>Tạo Video & Kịch bản</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
