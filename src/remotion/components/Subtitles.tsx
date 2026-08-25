import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface SubtitlesProps {
  text?: string;
  durationInFrames: number;
}

interface SentenceCue {
  text: string;
  startFrame: number;
  endFrame: number;
}

export const Subtitles: React.FC<SubtitlesProps> = ({
  text = '',
  durationInFrames
}) => {
  const frame = useCurrentFrame();

  // Split narrative text into individual continuous sentence cues
  const sentenceCues: SentenceCue[] = useMemo(() => {
    if (!text || text.trim() === '') return [];

    // Split by sentence delimiters (. ! ? \n)
    const rawSentences = text
      .split(/(?<=[.!?。])\s+|\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (rawSentences.length === 0) return [];

    const introPad = 8;
    const outroPad = 8;
    const availableFrames = Math.max(30, durationInFrames - introPad - outroPad);

    // Calculate proportional duration for each sentence
    const weights = rawSentences.map((s) => Math.max(20, s.length));
    const totalWeight = Math.max(1, weights.reduce((a, b) => a + b, 0));

    let currentStart = introPad;
    return rawSentences.map((sentenceText, idx) => {
      const cueSpan = Math.max(30, Math.floor((weights[idx] / totalWeight) * availableFrames));
      const startFrame = currentStart;
      const endFrame = idx === rawSentences.length - 1 ? durationInFrames - outroPad : startFrame + cueSpan;
      currentStart = endFrame;

      return {
        text: sentenceText,
        startFrame,
        endFrame
      };
    });
  }, [text, durationInFrames]);

  // Find currently active sentence cue
  const activeCue = useMemo(() => {
    if (sentenceCues.length === 0) return null;
    return (
      sentenceCues.find((cue) => frame >= cue.startFrame && frame < cue.endFrame) ||
      (frame >= sentenceCues[sentenceCues.length - 1]?.startFrame
        ? sentenceCues[sentenceCues.length - 1]
        : sentenceCues[0])
    );
  }, [sentenceCues, frame]);

  if (!activeCue) return null;

  // Smooth crossfade per sentence cue
  const cueDuration = Math.max(12, activeCue.endFrame - activeCue.startFrame);
  const fadeSpan = Math.min(6, Math.floor(cueDuration / 4));

  const cueOpacity = interpolate(
    frame,
    [
      activeCue.startFrame,
      activeCue.startFrame + fadeSpan,
      activeCue.endFrame - fadeSpan,
      activeCue.endFrame
    ],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

  const cueTranslateY = interpolate(
    frame,
    [activeCue.startFrame, activeCue.startFrame + fadeSpan],
    [8, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

  return (
    <div
      className="absolute bottom-12 sm:bottom-14 left-0 right-0 flex justify-center px-8 z-40 pointer-events-none"
      style={{
        opacity: cueOpacity,
        transform: `translateY(${cueTranslateY}px)`
      }}
    >
      <div className="max-w-4xl bg-slate-950/95 backdrop-blur-2xl text-white px-6 py-3.5 rounded-2xl border border-indigo-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.85)] flex items-center gap-4">
        {/* Animated Studio Speech Indicator */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 flex-shrink-0 shadow-inner">
          <span className="w-1.5 h-3.5 bg-indigo-400 rounded-full animate-pulse"></span>
          <span className="w-1.5 h-5 bg-purple-300 rounded-full animate-pulse delay-75"></span>
          <span className="w-1.5 h-3 bg-indigo-400 rounded-full animate-pulse delay-150"></span>
        </div>

        {/* High-Contrast Large Legible Subtitle Text */}
        <p className="text-sm sm:text-[15.5px] md:text-[16.5px] font-semibold leading-relaxed text-slate-50 tracking-wide drop-shadow-md">
          {activeCue.text}
        </p>
      </div>
    </div>
  );
};
