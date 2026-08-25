import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { EditorTheme, THEME_CONFIGS } from '../../types';

interface CodeEditorProps {
  code: string;
  language?: string;
  theme: EditorTheme;
  startTypingFromLine?: number; // 1-indexed: lines before this are pre-existing and visible immediately
  highlightLines?: number[];
  zoomScale?: number;
  focusLine?: number;
  durationInFrames: number;
}

interface ActionStep {
  frame: number;
  text: string;
  isTyping: boolean;
}

interface LineTimeline {
  lineNum: number;
  lineText: string;
  isPreExisting: boolean;
  startFrame: number;
  endTypeFrame: number;
  endLineFrame: number;
  steps: ActionStep[];
}

/**
 * Strict Sequential Human Keystroke Generator:
 * - Pre-existing lines (before startTypingFromLine) are 100% visible immediately without taking typing budget.
 * - Active lines (from startTypingFromLine onwards) type sequentially with natural human cadence.
 * - Guarantees all active lines finish before scene block hold phase.
 */
function buildSequentialLineTimelines(
  rawLines: string[],
  startTypingFromLine: number,
  durationInFrames: number
): LineTimeline[] {
  const introOffset = 8;
  const blockHoldFrames = Math.max(45, Math.floor(durationInFrames * 0.25));
  const totalAvailableSpan = Math.max(30, durationInFrames - blockHoldFrames - introOffset);

  // Identify lines that need to be actively typed
  const startIdx = Math.max(0, startTypingFromLine - 1);
  const activeLines = rawLines.slice(startIdx);

  // Compute proportional weights for only active lines
  const rawWeights = activeLines.map((l) => Math.max(8, l.length));
  const sumWeights = Math.max(1, rawWeights.reduce((a, b) => a + b, 0));

  let currentStart = introOffset;

  return rawLines.map((lineText, idx) => {
    // Check if this line is pre-existing
    if (idx < startIdx) {
      return {
        lineNum: idx + 1,
        lineText,
        isPreExisting: true,
        startFrame: 0,
        endTypeFrame: 0,
        endLineFrame: 0,
        steps: [{ frame: 0, text: lineText, isTyping: false }]
      };
    }

    const activeIdx = idx - startIdx;
    const lineWeightFraction = rawWeights[activeIdx] / sumWeights;
    const lineTotalBudget = Math.max(12, Math.floor(totalAvailableSpan * lineWeightFraction));

    // 65% for typing, 35% for post-line pause
    const typingSpan = Math.max(8, Math.floor(lineTotalBudget * 0.65));
    const startFrame = currentStart;
    const endTypeFrame = startFrame + typingSpan;
    const endLineFrame = startFrame + lineTotalBudget;

    currentStart = endLineFrame;

    // Generate keystroke steps
    const steps: ActionStep[] = [];
    const leadingSpaces = lineText.match(/^\s*/)?.[0] || '';
    const content = lineText.slice(leadingSpaces.length);

    steps.push({ frame: startFrame, text: leadingSpaces, isTyping: false });

    if (content.length > 0) {
      // Subtle typo only on line index 1 of active chunk if long enough
      const hasTypo = activeIdx === 1 && content.length > 14 && !content.startsWith('#') && !content.startsWith('//');
      const typoIndex = hasTypo ? Math.min(6, Math.floor(content.length / 2)) : -1;

      const typingUnits: { text: string; isTyping: boolean; weight: number }[] = [];
      let currentStr = leadingSpaces;

      for (let c = 0; c < content.length; c++) {
        const char = content[c];

        if (c === typoIndex) {
          const wrongChar = char === 'r' ? 't' : char === 'i' ? 'o' : char === 'e' ? 'w' : 'x';
          typingUnits.push({ text: currentStr + wrongChar, isTyping: true, weight: 1.2 });
          typingUnits.push({ text: currentStr + wrongChar, isTyping: false, weight: 1.8 });
          typingUnits.push({ text: currentStr, isTyping: true, weight: 1.0 });
          typingUnits.push({ text: currentStr, isTyping: false, weight: 1.0 });
        }

        currentStr += char;
        const weight = (char === ':' || char === '=' || char === '(' || char === '{') ? 2.0 : (c > 0 && content[c - 1] === ' ') ? 1.6 : 1.0;
        typingUnits.push({ text: currentStr, isTyping: true, weight });
      }

      const totalWeight = Math.max(1, typingUnits.reduce((sum, u) => sum + u.weight, 0));
      const availableTypingFrames = Math.max(6, endTypeFrame - startFrame - 1);

      let accumulatedWeight = 0;
      for (const unit of typingUnits) {
        accumulatedWeight += unit.weight;
        const unitFrame = Math.round(startFrame + 1 + (accumulatedWeight / totalWeight) * availableTypingFrames);
        steps.push({ frame: unitFrame, text: unit.text, isTyping: unit.isTyping });
      }
    }

    steps.push({ frame: endTypeFrame, text: lineText, isTyping: false });

    return {
      lineNum: idx + 1,
      lineText,
      isPreExisting: false,
      startFrame,
      endTypeFrame,
      endLineFrame,
      steps
    };
  });
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = 'python',
  theme,
  startTypingFromLine = 1,
  highlightLines = [],
  focusLine,
  durationInFrames
}) => {
  const frame = useCurrentFrame();
  const cfg = THEME_CONFIGS[theme] || THEME_CONFIGS['one-dark'];

  // All lines in this code block
  const rawLines = useMemo(() => code.split('\n'), [code]);

  // Strictly non-overlapping timelines for each line
  const lineTimelines = useMemo(() => {
    return buildSequentialLineTimelines(rawLines, startTypingFromLine || 1, durationInFrames);
  }, [rawLines, startTypingFromLine, durationInFrames]);

  // Determine line display states at current frame
  const lineStates = useMemo(() => {
    return lineTimelines.map((timeline) => {
      let displayedText = '';
      let isVisible = false;
      let isTyping = false;
      let isActive = false;

      if (timeline.isPreExisting) {
        // Pre-existing line: visible immediately
        displayedText = timeline.lineText;
        isVisible = true;
        isTyping = false;
        isActive = false;
      } else if (frame < timeline.startFrame) {
        // Active line hasn't started yet -> Hidden
        displayedText = '';
        isVisible = false;
        isTyping = false;
        isActive = false;
      } else if (frame >= timeline.endTypeFrame) {
        // Active line has finished typing -> Full text visible
        displayedText = timeline.lineText;
        isVisible = true;
        isTyping = false;
        isActive = frame < timeline.endLineFrame;
      } else {
        // Active line is currently typing
        let currentStep = timeline.steps[0];
        for (const step of timeline.steps) {
          if (frame >= step.frame) {
            currentStep = step;
          } else {
            break;
          }
        }
        displayedText = currentStep ? currentStep.text : '';
        isVisible = true;
        isTyping = currentStep ? currentStep.isTyping : false;
        isActive = true;
      }

      return {
        fullText: timeline.lineText,
        displayedText,
        isVisible,
        isTyping,
        isActive,
        lineNum: timeline.lineNum
      };
    });
  }, [lineTimelines, frame]);

  // Check if all lines have completed typing
  const isBlockCompleted = lineStates.every((l) => l.isVisible && l.displayedText === l.fullText);

  // Active line calculation for dynamic auto-scroll
  const activeLineObj = lineStates.find((l) => l.isActive);
  const currentFocusLine = activeLineObj
    ? activeLineObj.lineNum
    : focusLine || startTypingFromLine || 1;

  // Adaptive font sizing & line height based on code density
  const fontSizeClass = rawLines.length > 25 ? 'text-[13.5px]' : rawLines.length > 15 ? 'text-[14.5px]' : 'text-[15.5px]';
  const LINE_ROW_HEIGHT = rawLines.length > 25 ? 30 : 34;
  const VISIBLE_LINES = 13;

  // Precise Centered Viewport Auto-Scroll:
  const maxScrollPx = Math.max(0, (rawLines.length - VISIBLE_LINES) * LINE_ROW_HEIGHT);
  const targetScrollPx = currentFocusLine > 10 ? (currentFocusLine - 8) * LINE_ROW_HEIGHT : 0;
  const lineTranslateY = -Math.min(maxScrollPx, targetScrollPx);

  // Syntax highlighting
  const prismLang = useMemo(() => {
    const lang = (language || 'python').toLowerCase();
    return Prism.languages[lang] || Prism.languages.javascript || Prism.languages.clike;
  }, [language]);

  // Calm Frame-based Cursor Blinking (18 frames visible, 18 frames hidden = 1.2s total calm cycle at 30fps)
  const isCursorFrameVisible = Math.floor(frame / 18) % 2 === 0;

  return (
    <div
      className={`w-full h-full flex flex-col font-mono ${fontSizeClass} leading-relaxed overflow-hidden relative select-none`}
      style={{
        backgroundColor: cfg.editorBg,
        color: cfg.textColor
      }}
    >
      {/* Code Viewport (fixed container with overflow hidden) */}
      <div className="flex-1 px-5 py-4 overflow-hidden relative">
        {/* Animated Scrolling Canvas */}
        <div
          className="flex flex-col space-y-0.5 transition-transform duration-200 origin-top"
          style={{
            transform: `translateY(${lineTranslateY}px)`
          }}
        >
          {lineStates.map((lineState, idx) => {
            const isTargetHighlight = highlightLines.includes(lineState.lineNum);
            const isCurrentActive = lineState.isActive;

            // Highlight state: active typing (blue) or completed spotlight (amber)
            const showSpotlight = isBlockCompleted && isTargetHighlight;

            let highlightedHtml = '';
            try {
              highlightedHtml = Prism.highlight(lineState.displayedText, prismLang, language);
            } catch {
              highlightedHtml = lineState.displayedText;
            }

            // If line is not yet visible, keep blank space so layout does not jump
            if (!lineState.isVisible) {
              return (
                <div key={idx} className="flex items-center min-h-[30px] opacity-0 pointer-events-none">
                  <span className="w-10 text-right pr-3 text-xs font-mono select-none text-slate-600">
                    {lineState.lineNum}
                  </span>
                  <span className="pl-3 whitespace-pre font-mono">&nbsp;</span>
                </div>
              );
            }

            // Cursor visibility: always solid during active typing, calmly blinking during reading pause
            const showCursor = lineState.isTyping || isCursorFrameVisible;

            return (
              <div
                key={idx}
                className={`flex items-center min-h-[30px] rounded-md transition-all duration-300 relative ${
                  isCurrentActive
                    ? 'bg-indigo-500/15 border-l-4 border-indigo-400 shadow-sm'
                    : showSpotlight
                    ? 'bg-amber-500/15 border-l-4 border-amber-400 font-medium shadow-[0_0_12px_rgba(245,158,11,0.12)]'
                    : 'border-l-4 border-transparent'
                }`}
                style={{
                  backgroundColor: isCurrentActive
                    ? cfg.lineHighlightBg
                    : showSpotlight
                    ? 'rgba(245, 158, 11, 0.14)'
                    : 'transparent',
                  opacity: isBlockCompleted && highlightLines.length > 0 && !isTargetHighlight ? 0.72 : 1
                }}
              >
                {/* Line Number */}
                <div
                  className="w-10 text-right pr-3 text-xs font-mono select-none flex-shrink-0 transition-colors"
                  style={{
                    color: isCurrentActive
                      ? cfg.accentColor
                      : showSpotlight
                      ? '#fbbf24'
                      : '#64748b',
                    fontWeight: isCurrentActive || showSpotlight ? '700' : 'normal'
                  }}
                >
                  {lineState.lineNum}
                </div>

                {/* Code Line Content */}
                <div className={`pl-3 pr-4 py-0.5 whitespace-pre font-mono ${fontSizeClass} flex-1 flex items-center overflow-x-auto scrollbar-none`}>
                  <span dangerouslySetInnerHTML={{ __html: highlightedHtml || '&nbsp;' }} />

                  {/* Calm deterministic cursor on active line */}
                  {isCurrentActive && (
                    <span
                      className="inline-block w-2.5 h-4 ml-1 align-middle rounded-sm"
                      style={{
                        backgroundColor: cfg.accentColor,
                        opacity: showCursor ? 1 : 0
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block Retention Banner */}
      {isBlockCompleted && (
        <div className="absolute top-3 right-4 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-sans font-medium flex items-center gap-1.5 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Khối mã nguồn hoàn chỉnh ({rawLines.length} dòng)</span>
        </div>
      )}
    </div>
  );
};
