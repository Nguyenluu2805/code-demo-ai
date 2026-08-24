import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface SubtitlesProps {
  text?: string;
  durationInFrames: number;
}

export const Subtitles: React.FC<SubtitlesProps> = ({
  text = '',
  durationInFrames
}) => {
  const frame = useCurrentFrame();

  if (!text || text.trim() === '') return null;

  // Smooth fade in & fade out
  const opacity = interpolate(
    frame,
    [0, 10, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

  const translateY = interpolate(
    frame,
    [0, 10],
    [10, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

  return (
    <div
      className="absolute bottom-6 left-0 right-0 flex justify-center px-8 z-30 pointer-events-none"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`
      }}
    >
      <div className="max-w-4xl bg-slate-950/90 backdrop-blur-md text-white px-6 py-3 rounded-xl border border-white/10 shadow-2xl text-center">
        <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-slate-100 text-shadow">
          {text}
        </p>
      </div>
    </div>
  );
};
