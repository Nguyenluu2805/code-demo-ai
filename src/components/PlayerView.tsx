import React, { useRef, useEffect } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { Storyboard } from '../types';
import { MainComposition } from '../remotion/Composition';
import { SubtitlesIcon, VideoCameraIcon, ReplayIcon, ClockIcon } from './Icons';

interface PlayerViewProps {
  storyboard: Storyboard;
  showSubtitles: boolean;
  onToggleSubtitles: () => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  storyboard,
  showSubtitles,
  onToggleSubtitles
}) => {
  const playerRef = useRef<PlayerRef>(null);

  const totalFrames = Math.max(
    30,
    storyboard.scenes.reduce((acc, s) => acc + s.durationInFrames, 0)
  );

  const isPortrait = storyboard.aspectRatio === '9:16';
  const width = isPortrait ? 1080 : 1920;
  const height = isPortrait ? 1920 : 1080;

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
  }, [storyboard]);

  const handleRestart = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    playerRef.current.play();
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 shadow-2xl flex flex-col items-center backdrop-blur-xl transition-all">
      {/* Player Header Bar */}
      <div className="w-full flex items-center justify-between pb-3.5 border-b border-zinc-800/80 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <VideoCameraIcon className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight truncate max-w-xs sm:max-w-md">
              {storyboard.title || 'Studio Video Preview'}
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
              <span>{isPortrait ? '1080x1920 (9:16)' : '1920x1080 (16:9)'}</span>
              <span>•</span>
              <span>{storyboard.fps || 30} FPS</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtitles Toggle Pill */}
          <button
            onClick={onToggleSubtitles}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              showSubtitles
                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 shadow-sm'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Bật hoặc tắt phụ đề kịch bản trên video"
          >
            <SubtitlesIcon className="w-3.5 h-3.5" />
            <span>Phụ đề: {showSubtitles ? 'Bật' : 'Tắt'}</span>
          </button>

          {/* Time Duration Badge */}
          <span className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
            <ClockIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>{(totalFrames / (storyboard.fps || 30)).toFixed(1)}s</span>
          </span>
        </div>
      </div>

      {/* Main Video Canvas Container */}
      <div className="w-full flex justify-center items-center rounded-xl overflow-hidden bg-black border border-zinc-800 aspect-video max-h-[580px] lg:max-h-[640px] relative shadow-2xl">
        <Player
          key={`${storyboard.title}-${storyboard.scenes.length}-${storyboard.theme}-${storyboard.aspectRatio}`}
          ref={playerRef}
          component={MainComposition as any}
          inputProps={{
            storyboard,
            showSubtitles
          }}
          durationInFrames={totalFrames}
          compositionWidth={width}
          compositionHeight={height}
          fps={storyboard.fps || 30}
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '640px'
          }}
          controls
          autoPlay={false}
          loop
        />
      </div>

      {/* Bottom Player Controls */}
      <div className="w-full flex items-center justify-between pt-3.5 mt-1 text-xs text-zinc-400">
        <button
          type="button"
          onClick={handleRestart}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all font-medium cursor-pointer shadow-sm active:scale-98"
        >
          <ReplayIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>Xem lại từ đầu</span>
        </button>

        <span className="text-[11px] text-zinc-400 font-normal">
          Dùng phím Space để Play/Pause • Bấm góc video để xem Fullscreen
        </span>
      </div>
    </div>
  );
};
