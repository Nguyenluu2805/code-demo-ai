import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';

interface TerminalProps {
  command?: string;
  output?: string;
  durationInFrames: number;
}

export const Terminal: React.FC<TerminalProps> = ({
  command = 'python main.py',
  output = 'Execution completed.',
  durationInFrames
}) => {
  const frame = useCurrentFrame();

  // Organic command typing schedule with brief thinking hesitation
  const { displayedCommand, isOutputVisible } = useMemo(() => {
    const introFrames = 15; // human wait before typing command
    let currentFrame = introFrames;
    let charsTyped = 0;

    for (let i = 0; i < command.length; i++) {
      if (frame >= currentFrame) {
        charsTyped = i + 1;
      }
      // slight hesitation at space
      currentFrame += command[i] === ' ' ? 7 : ((i * 5) % 2) + 3;
    }

    const commandDoneFrame = currentFrame;
    const enterDelay = 12; // pause before hitting Enter
    const outputFrame = commandDoneFrame + enterDelay;

    return {
      displayedCommand: command.slice(0, charsTyped),
      isOutputVisible: frame >= outputFrame
    };
  }, [command, frame]);

  const isCursorFrameVisible = Math.floor(frame / 18) % 2 === 0;

  const formatOutputLine = (line: string, index: number) => {
    let colorClass = 'text-slate-300';
    if (line.includes('[SUCCESS]') || line.includes('Sorted array') || line.includes('200') || line.includes('thành công') || line.includes('hoàn thành')) {
      colorClass = 'text-emerald-400 font-semibold';
    } else if (line.includes('[ERROR]') || line.includes('401') || line.includes('403') || line.includes('Error')) {
      colorClass = 'text-rose-400 font-semibold';
    } else if (line.includes('[INFO]') || line.includes('>>')) {
      colorClass = 'text-sky-400';
    }

    return (
      <div key={index} className={`font-mono text-[16px] leading-relaxed whitespace-pre-wrap ${colorClass}`}>
        {line}
      </div>
    );
  };

  const outputLines = output.split('\n');

  return (
    <div className="w-full h-full p-6 sm:p-8 bg-[#0a0d14] text-slate-100 font-mono text-[16px] leading-relaxed overflow-hidden">
      {/* Shell Prompt */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-emerald-400 font-bold">developer@macbook</span>
        <span className="text-slate-500">:</span>
        <span className="text-sky-400 font-medium">~/project</span>
        <span className="text-slate-400">$</span>
        <span className="text-white font-medium">{displayedCommand}</span>
        
        {/* Calm Cursor */}
        {!isOutputVisible && (
          <span
            className="inline-block w-2.5 h-5 bg-emerald-400 ml-1 rounded-sm"
            style={{ opacity: isCursorFrameVisible ? 1 : 0 }}
          />
        )}
      </div>

      {/* Terminal Output */}
      {isOutputVisible && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 animate-fadeIn">
          {outputLines.map((line, idx) => formatOutputLine(line, idx))}
        </div>
      )}
    </div>
  );
};
