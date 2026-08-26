import React, { useState } from 'react';
import { Scene, Storyboard } from '../../types';
import { LayersIcon, PlusIcon, TrashIcon, CodeBracketIcon, TerminalIcon, MessageQuoteIcon, FileDocIcon, MicIcon, ClockIcon } from '../common/Icons';
import { FileIcon } from '../../remotion/components/FileIcon';

interface TimelineEditorProps {
  storyboard: Storyboard;
  onUpdateStoryboard: (updated: Storyboard) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  storyboard,
  onUpdateStoryboard
}) => {
  const [activeSceneId, setActiveSceneId] = useState<string>(storyboard.scenes[0]?.id || '');
  const [viewMode, setViewMode] = useState<'scene' | 'fullScript'>('scene');

  const updateScene = (sceneId: string, patch: Partial<Scene>) => {
    const updatedScenes = storyboard.scenes.map((sc) => {
      if (sc.id === sceneId) {
        return { ...sc, ...patch };
      }
      return sc;
    });
    onUpdateStoryboard({ ...storyboard, scenes: updatedScenes });
  };

  const handleMultiplyAllDurations = (factor: number) => {
    const updatedScenes = storyboard.scenes.map((sc) => ({
      ...sc,
      durationInFrames: Math.max(90, Math.round(sc.durationInFrames * factor))
    }));
    onUpdateStoryboard({ ...storyboard, scenes: updatedScenes });
  };

  const handleAddScene = (type: 'editor' | 'terminal') => {
    const newId = `scene-${Date.now()}`;
    const newScene: Scene = type === 'editor'
      ? {
          id: newId,
          type: 'editor',
          title: `Phân cảnh ${storyboard.scenes.length + 1}`,
          filename: 'code.py',
          language: 'python',
          code: '# Nhập mã nguồn của bạn vào đây\n\nprint("Hello, World!")',
          highlightLines: [3],
          zoomScale: 1.1,
          focusLine: 1,
          speakerScript: 'Chào bạn, đây là đoạn code mới chúng ta vừa thêm vào. Hãy cùng theo dõi từng câu lệnh được thực thi.',
          durationInFrames: 360
        }
      : {
          id: newId,
          type: 'terminal',
          title: `Chạy Terminal ${storyboard.scenes.length + 1}`,
          command: 'python code.py',
          output: 'Hello, World!',
          speakerScript: 'Chạy thử kết quả lệnh trên cửa sổ dòng lệnh và kiểm tra đầu ra thành công.',
          durationInFrames: 240
        };

    onUpdateStoryboard({
      ...storyboard,
      scenes: [...storyboard.scenes, newScene]
    });
    setActiveSceneId(newId);
  };

  const handleDeleteScene = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (storyboard.scenes.length <= 1) {
      alert('Video cần có ít nhất 1 phân cảnh!');
      return;
    }
    const updated = storyboard.scenes.filter((sc) => sc.id !== sceneId);
    onUpdateStoryboard({ ...storyboard, scenes: updated });
    if (activeSceneId === sceneId) {
      setActiveSceneId(updated[0]?.id || '');
    }
  };

  const activeScene = storyboard.scenes.find((s) => s.id === activeSceneId) || storyboard.scenes[0];

  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl transition-all">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800/80 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <LayersIcon className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">Cấu Trúc Phân Cảnh & Lời Thoại</h2>
            <p className="text-[11px] text-zinc-400">
              {storyboard.scenes.length} phân cảnh • Tổng ~{Math.round(storyboard.scenes.reduce((a, s) => a + s.durationInFrames, 0) / (storyboard.fps || 30))} giây
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 shadow-inner">
          <button
            type="button"
            onClick={() => setViewMode('scene')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'scene'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Chỉnh sửa cảnh
          </button>
          <button
            type="button"
            onClick={() => setViewMode('fullScript')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'fullScript'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileDocIcon className="w-3.5 h-3.5" />
            <span>Kịch bản nói tổng thể</span>
          </button>
        </div>
      </div>

      {viewMode === 'scene' ? (
        <>
          {/* Quick Scene Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
            <button
              type="button"
              onClick={() => handleMultiplyAllDurations(1.35)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer shadow-sm"
              title="Kéo dài thời lượng tất cả các cảnh thêm 35%"
            >
              <ClockIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Chậm hơn (+35% thời lượng)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddScene('editor')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer shadow-sm"
              >
                <PlusIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Thêm Cảnh Code</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddScene('terminal')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer shadow-sm"
              >
                <PlusIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Thêm Terminal</span>
              </button>
            </div>
          </div>

          {/* Scene Carousel Tabs */}
          <div className="flex gap-2.5 overflow-x-auto pb-3.5 mb-4 scrollbar-thin">
            {storyboard.scenes.map((scene, idx) => {
              const isActive = scene.id === activeSceneId;
              return (
                <div
                  key={scene.id}
                  onClick={() => setActiveSceneId(scene.id)}
                  className={`flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 border-indigo-500/80 text-white shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  {scene.type === 'editor' ? (
                    <FileIcon filename={scene.filename || 'main.py'} className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <TerminalIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                  <span className="font-semibold text-zinc-300">Cảnh {idx + 1}:</span>
                  <span className="truncate max-w-[120px]">{scene.title || scene.filename || 'Phân cảnh'}</span>
                  
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {(scene.durationInFrames / (storyboard.fps || 30)).toFixed(1)}s
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteScene(scene.id, e)}
                    className="text-zinc-500 hover:text-rose-400 p-0.5 transition-colors ml-0.5 cursor-pointer"
                    title="Xóa phân cảnh này"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Scene Editor Form */}
          {activeScene && (
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tiêu đề phân cảnh</label>
                  <input
                    type="text"
                    value={activeScene.title || ''}
                    onChange={(e) => updateScene(activeScene.id, { title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-zinc-400">
                      Thời lượng: <strong className="text-indigo-400 font-mono">{(activeScene.durationInFrames / (storyboard.fps || 30)).toFixed(1)}s</strong>
                    </label>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="720"
                    step="15"
                    value={activeScene.durationInFrames}
                    onChange={(e) => updateScene(activeScene.id, { durationInFrames: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer mt-1"
                  />
                </div>

                {/* Editor vs Terminal specific fields */}
                {activeScene.type === 'editor' ? (
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tên tập tin</label>
                    <input
                      type="text"
                      value={activeScene.filename || ''}
                      onChange={(e) => updateScene(activeScene.id, { filename: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono transition-all"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Lệnh thực thi</label>
                    <input
                      type="text"
                      value={activeScene.command || ''}
                      onChange={(e) => updateScene(activeScene.id, { command: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Code Area or Terminal Output Area */}
              {activeScene.type === 'editor' ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                      <CodeBracketIcon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Mã nguồn hiển thị (Gõ phím tự động)</span>
                    </label>

                    {/* Highlight Lines */}
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>Dòng highlight:</span>
                      <input
                        type="text"
                        placeholder="ví dụ: 1, 2, 4"
                        value={activeScene.highlightLines?.join(', ') || ''}
                        onChange={(e) => {
                          const nums = e.target.value
                            .split(',')
                            .map((s) => parseInt(s.trim(), 10))
                            .filter((n) => !isNaN(n));
                          updateScene(activeScene.id, { highlightLines: nums });
                        }}
                        className="w-28 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <textarea
                    value={activeScene.code || ''}
                    onChange={(e) => updateScene(activeScene.id, { code: e.target.value })}
                    rows={5}
                    className="w-full bg-[#18181b] border border-zinc-800 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/80 leading-relaxed shadow-inner"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kết quả in ra Terminal</span>
                  </label>
                  <textarea
                    value={activeScene.output || ''}
                    onChange={(e) => updateScene(activeScene.id, { output: e.target.value })}
                    rows={4}
                    className="w-full bg-[#090d16] border border-zinc-800 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-emerald-400 focus:outline-none focus:border-indigo-500/80 leading-relaxed shadow-inner"
                  />
                </div>
              )}

              {/* Speaker Script / Subtitle Text Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                    <MicIcon className="w-4 h-4 text-indigo-400" />
                    <span>Lời thuyết minh cho cảnh này (Speaker Script / Phụ đề)</span>
                  </label>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {activeScene.speakerScript.length} ký tự
                  </span>
                </div>
                <textarea
                  value={activeScene.speakerScript}
                  onChange={(e) => updateScene(activeScene.id, { speakerScript: e.target.value })}
                  rows={4}
                  placeholder="Nhập toàn văn lời thuyết minh bạn sẽ đọc hoặc muốn hiển thị trên phụ đề cho phân cảnh này..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500/80 rounded-xl p-3.5 text-xs sm:text-sm text-white focus:outline-none leading-relaxed placeholder-zinc-500 shadow-inner"
                />
              </div>
            </div>
          )}
        </>
      ) : (
        /* Full Teleprompter View */
        <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-300 flex items-center gap-2.5">
            <MicIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>Kịch bản thuyết minh toàn cảnh: Bạn có thể đọc trực tiếp khi thu âm hoặc chỉnh sửa nội dung thoại cho từng phân đoạn bên dưới.</span>
          </div>

          {storyboard.scenes.map((scene, idx) => {
            let startFrame = 0;
            const fps = storyboard.fps || 30;
            for (let i = 0; i < idx; i++) startFrame += storyboard.scenes[i].durationInFrames;
            const endFrame = startFrame + scene.durationInFrames;
            const startTimeStr = `${Math.floor(startFrame / fps / 60).toString().padStart(2, '0')}:${Math.floor((startFrame / fps) % 60).toString().padStart(2, '0')}`;
            const endTimeStr = `${Math.floor(endFrame / fps / 60).toString().padStart(2, '0')}:${Math.floor((endFrame / fps) % 60).toString().padStart(2, '0')}`;

            return (
              <div key={scene.id} className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-bold text-xs flex items-center justify-center border border-zinc-700">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-xs text-white">
                      {scene.title || `Phân cảnh ${idx + 1}`}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      [{startTimeStr} - {endTimeStr}]
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-indigo-400">
                    {scene.type}
                  </span>
                </div>

                <textarea
                  value={scene.speakerScript}
                  onChange={(e) => updateScene(scene.id, { speakerScript: e.target.value })}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
