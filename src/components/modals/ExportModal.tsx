import React, { useState, useEffect, useRef } from 'react';
import { Storyboard } from '../../types';
import { generateSrtContent, generateMarkdownScript, downloadFile } from '../../services/exportService';
import { SparklesIcon, FileDocIcon, SubtitlesIcon, CodeBracketIcon, TerminalIcon, CopyIcon, CheckIcon, CloseIcon, VideoCameraIcon, DownloadIcon } from '../common/Icons';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyboard: Storyboard;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  storyboard
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [renderStatus, setRenderStatus] = useState<'idle' | 'rendering' | 'completed' | 'error'>('idle');
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderMessage, setRenderMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleStartRender = async () => {
    setRenderStatus('rendering');
    setRenderProgress(5);
    setRenderMessage('Đang khởi tạo tiến trình render video...');
    setDownloadUrl(null);

    try {
      const resp = await fetch('/api/render-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyboard, showSubtitles: true })
      });

      if (!resp.ok) {
        throw new Error(`Lỗi khởi động render: HTTP ${resp.status}`);
      }

      if (pollTimerRef.current) clearInterval(pollTimerRef.current);

      pollTimerRef.current = setInterval(async () => {
        try {
          const statusResp = await fetch('/api/render-status');
          if (statusResp.ok) {
            const data = await statusResp.json();
            setRenderStatus(data.status);
            setRenderProgress(data.progress || 0);
            setRenderMessage(data.message || '');

            if (data.status === 'completed') {
              if (pollTimerRef.current) clearInterval(pollTimerRef.current);
              setDownloadUrl(data.videoPath || '/api/download-video');
            } else if (data.status === 'error') {
              if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            }
          }
        } catch (e) {
          console.error('Failed to poll status:', e);
        }
      }, 1000);
    } catch (err: any) {
      setRenderStatus('error');
      setRenderMessage(err.message || 'Lỗi kết nối máy chủ');
    }
  };

  const handleDownloadMarkdown = () => {
    const content = generateMarkdownScript(storyboard);
    const filename = `${storyboard.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_script.md`;
    downloadFile(content, filename, 'text/markdown');
  };

  const handleDownloadSrt = () => {
    const content = generateSrtContent(storyboard);
    const filename = `${storyboard.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_subtitles.srt`;
    downloadFile(content, filename, 'text/plain');
  };

  const handleDownloadJson = () => {
    const content = JSON.stringify(storyboard, null, 2);
    const filename = `${storyboard.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_project.json`;
    downloadFile(content, filename, 'application/json');
  };

  const handleCopyCliCommand = () => {
    const cmd = `npx remotion render src/remotion/index.ts CodeDemo out/video.mp4`;
    navigator.clipboard.writeText(cmd);
    setCopiedType('cli');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <SparklesIcon className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-white">Xuất Video & Tài Nguyên</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Main Action: 1-Click Video Render & Download */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-violet-950/30 border border-indigo-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 flex-shrink-0">
                <VideoCameraIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Render & Tải Video MP4 (1080p Full HD)</h4>
                <p className="text-xs text-zinc-400">
                  Xuất file MP4 với tốc độ gõ chuẩn người thật, icon VS Code & phụ đề
                </p>
              </div>
            </div>

            {/* Progress / Status display */}
            {renderStatus === 'rendering' && (
              <div className="space-y-2 mt-3 p-3.5 bg-zinc-950 rounded-xl border border-indigo-500/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-300 font-medium flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                    <span>{renderMessage || 'Đang xử lý...'}</span>
                  </span>
                  <span className="font-mono font-bold text-indigo-400">{renderProgress}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
              </div>
            )}

            {renderStatus === 'completed' && (
              <div className="space-y-3 mt-3 p-3.5 bg-emerald-950/50 rounded-xl border border-emerald-500/40 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <CheckIcon className="w-4 h-4 text-emerald-400" />
                  <span>Render thành công 100%! File video MP4 đã sẵn sàng tải về.</span>
                </div>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download="CodeDemo_Video.mp4"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Tải File Video MP4 Về Máy</span>
                  </a>
                )}
              </div>
            )}

            {renderStatus === 'error' && (
              <div className="mt-3 p-3 bg-rose-950/60 rounded-xl border border-rose-500/40 text-xs text-rose-300">
                {renderMessage || 'Có lỗi xảy ra trong quá trình render.'}
              </div>
            )}

            {renderStatus !== 'rendering' && renderStatus !== 'completed' && (
              <button
                type="button"
                onClick={handleStartRender}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-98 cursor-pointer"
              >
                <VideoCameraIcon className="w-4 h-4" />
                <span>Bắt đầu Render Video MP4</span>
              </button>
            )}
          </div>

          <div className="border-t border-zinc-800 pt-3">
            <p className="text-xs text-zinc-400 mb-2.5 font-medium">
              Hoặc tải các định dạng kịch bản đi kèm:
            </p>

            {/* Other Formats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Markdown Script */}
              <button
                type="button"
                onClick={handleDownloadMarkdown}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <FileDocIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs text-white">Kịch bản (.MD)</span>
                <span className="text-[10px] text-zinc-400 mt-0.5">Lời thoại thuyết minh</span>
              </button>

              {/* SRT Subtitles */}
              <button
                type="button"
                onClick={handleDownloadSrt}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <SubtitlesIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs text-white">Phụ đề (.SRT)</span>
                <span className="text-[10px] text-zinc-400 mt-0.5">Mốc thời gian chuẩn</span>
              </button>

              {/* Project JSON */}
              <button
                type="button"
                onClick={handleDownloadJson}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <CodeBracketIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs text-white">Cấu hình (.JSON)</span>
                <span className="text-[10px] text-zinc-400 mt-0.5">Lưu trữ storyboard</span>
              </button>
            </div>
          </div>

          {/* Render MP4 CLI info */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lệnh Render CLI:</span>
              </div>
              <button
                onClick={handleCopyCliCommand}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
              >
                {copiedType === 'cli' ? (
                  <>
                    <CheckIcon className="w-3 h-3 text-emerald-400" />
                    <span>Đã copy</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-800 overflow-x-auto">
              npx remotion render src/remotion/index.ts CodeDemo out/video.mp4
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
