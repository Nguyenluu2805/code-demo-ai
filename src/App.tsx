import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PromptInput } from './components/editor/PromptInput';
import { PlayerView } from './components/player/PlayerView';
import { TimelineEditor } from './components/editor/TimelineEditor';
import { ExportModal } from './components/modals/ExportModal';
import { Toast } from './components/common/Toast';
import { EditorTheme, AspectRatio, SpeedMode } from './types';
import { generateStoryboardWithAI } from './services/aiService';
import { useStoryboard } from './hooks/useStoryboard';
import { useToast } from './hooks/useToast';

export function App() {
  const {
    storyboard,
    setStoryboard,
    speedMode,
    updateSpeedMode,
    updateTheme,
    updateAspectRatio,
    loadPreset
  } = useStoryboard();

  const { toastMessage, showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Read Gemini API Key from environment variable
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';

  const handleSpeedModeChange = (newSpeed: SpeedMode) => {
    updateSpeedMode(newSpeed);
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
      const { storyboard: generated, source } = await generateStoryboardWithAI(
        prompt,
        apiKey,
        language,
        theme,
        aspectRatio
      );

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
    const loaded = loadPreset(presetKey);
    if (loaded) {
      showToast(`Đã tải kịch bản: ${loaded.title}`, 'info');
    }
  };

  const handleThemeChange = (theme: EditorTheme) => {
    updateTheme(theme);
    showToast(`Đã áp dụng theme: ${theme}`, 'info');
  };

  const handleAspectRatioChange = (aspectRatio: AspectRatio) => {
    updateAspectRatio(aspectRatio);
    showToast(`Đã chuyển tỉ lệ: ${aspectRatio}`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Ambient Cyber Light Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-3xl opacity-60" />
      </div>

      {/* Top Navbar */}
      <Navbar onOpenExportModal={() => setIsExportModalOpen(true)} />

      {/* Floating Notification Toast */}
      <Toast message={toastMessage} />

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

      {/* Footer */}
      <Footer />

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
