import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PromptInput } from './components/PromptInput';
import { PlayerView } from './components/PlayerView';
import { TimelineEditor } from './components/TimelineEditor';
import { ExportModal } from './components/ExportModal';
import { Storyboard, EditorTheme, AspectRatio, SpeedMode } from './types';
import { PRESET_TEMPLATES, generateStoryboardWithAI } from './services/aiService';
import { CheckIcon, SparklesIcon, CloseIcon } from './components/Icons';

export function App() {
  const [storyboard, setStoryboard] = useState<Storyboard>(PRESET_TEMPLATES['quicksort-python']);
  const [speedMode, setSpeedMode] = useState<SpeedMode>('normal');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Read Gemini API Key from environment variable
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSpeedModeChange = (newSpeed: SpeedMode) => {
    setSpeedMode(newSpeed);
    const speedMultipliers: Record<SpeedMode, number> = {
      slow: 1.6,
      relaxed: 1.25,
      normal: 1.0,
      fast: 0.7
    };

    const factor = speedMultipliers[newSpeed] / (speedMultipliers[speedMode] || 1.0);
    const updatedScenes = storyboard.scenes.map((sc) => ({
      ...sc,
      durationInFrames: Math.max(120, Math.round(sc.durationInFrames * factor))
    }));

    setStoryboard((prev) => ({
      ...prev,
      speedMode: newSpeed,
      scenes: updatedScenes
    }));

    const labelMap: Record<SpeedMode, string> = {
      slow: 'Chậm (0.5x)',
      relaxed: 'Chậm vừa (0.75x)',
      normal: 'Chuẩn (1.0x)',
      fast: 'Nhanh (1.5x)'
    };
    showToast(`Đã chuyển tốc độ: ${labelMap[newSpeed]}`, 'info');
  };

  const handleGenerate = async (
    prompt: string,
    language: string,
    theme: EditorTheme,
    aspectRatio: AspectRatio
  ) => {
    setIsLoading(true);
    try {
      const { storyboard: generated, source } = await generateStoryboardWithAI(prompt, apiKey, language, theme, aspectRatio);
      
      if (speedMode === 'slow') {
        generated.scenes = generated.scenes.map((s) => ({
          ...s,
          durationInFrames: Math.round(s.durationInFrames * 1.5)
        }));
      } else if (speedMode === 'relaxed') {
        generated.scenes = generated.scenes.map((s) => ({
          ...s,
          durationInFrames: Math.round(s.durationInFrames * 1.25)
        }));
      }

      setStoryboard(generated);

      if (source === 'gemini-ai') {
        showToast(`✨ Google Gemini AI đã tạo thành công: ${generated.title}`, 'success');
      } else if (source === 'code-parser') {
        showToast(`⚡ Đã phân tích cú pháp mã nguồn thành công: ${generated.title}`, 'success');
      } else {
        showToast(`📦 Đã tổng hợp kịch bản chuyên sâu: ${generated.title}`, 'success');
      }
    } catch (err: any) {
      console.error('Failed to generate:', err);
      showToast(`Lỗi khi tạo video: ${err.message || 'Thử lại'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (presetKey: string) => {
    if (PRESET_TEMPLATES[presetKey]) {
      const preset = { ...PRESET_TEMPLATES[presetKey] };
      if (speedMode === 'slow') {
        preset.scenes = preset.scenes.map((s) => ({ ...s, durationInFrames: Math.round(s.durationInFrames * 1.5) }));
      }
      setStoryboard(preset);
      showToast(`Đã tải kịch bản: ${preset.title}`, 'info');
    }
  };

  const handleThemeChange = (theme: EditorTheme) => {
    setStoryboard((prev) => ({ ...prev, theme }));
    showToast(`Đã áp dụng theme: ${theme}`, 'info');
  };

  const handleAspectRatioChange = (aspectRatio: AspectRatio) => {
    setStoryboard((prev) => ({ ...prev, aspectRatio }));
    showToast(`Đã chuyển tỉ lệ: ${aspectRatio}`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-3xl opacity-60" />
      </div>

      {/* Top Navbar */}
      <Navbar
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce-short">
          <div
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-2xl text-xs font-medium backdrop-blur-md ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : toastMessage.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : 'bg-zinc-900/90 border-zinc-700/80 text-zinc-200'
            }`}
          >
            {toastMessage.type === 'success' && <CheckIcon className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'error' && <CloseIcon className="w-4 h-4 text-rose-400" />}
            {toastMessage.type === 'info' && <SparklesIcon className="w-4 h-4 text-indigo-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-[1540px] w-full mx-auto px-4 sm:px-8 py-6 space-y-6 relative z-10">
        {/* Row 1: AI Prompt & Code Input Area */}
        <PromptInput
          onGenerate={handleGenerate}
          onSelectPreset={handleSelectPreset}
          isLoading={isLoading}
          currentTheme={storyboard.theme}
          currentAspectRatio={storyboard.aspectRatio}
          currentSpeedMode={speedMode}
          onThemeChange={handleThemeChange}
          onAspectRatioChange={handleAspectRatioChange}
          onSpeedModeChange={handleSpeedModeChange}
        />

        {/* Row 2: Grid with Live Player and Timeline Scene Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Real-time Video Preview Player (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <PlayerView
              storyboard={storyboard}
              showSubtitles={showSubtitles}
              onToggleSubtitles={() => setShowSubtitles((prev) => !prev)}
            />
          </div>

          {/* Right Column: Timeline Scene & Script Editor (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <TimelineEditor
              storyboard={storyboard}
              onUpdateStoryboard={setStoryboard}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        storyboard={storyboard}
      />
    </div>
  );
}
export default App;
