import React, { useMemo } from 'react';
import { Sequence, AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { Storyboard, THEME_CONFIGS, Scene } from '../types';
import { WindowChrome } from './components/WindowChrome';
import { CodeEditor } from './components/CodeEditor';
import { Terminal } from './components/Terminal';
import { Subtitles } from './components/Subtitles';

interface MainCompositionProps {
  storyboard: Storyboard;
  showSubtitles?: boolean;
}

const SceneItem: React.FC<{
  scene: Scene;
  theme: any;
  duration: number;
  showSubtitles: boolean;
}> = ({ scene, theme, duration, showSubtitles }) => {
  const frame = useCurrentFrame();

  // Smooth 8-frame scene transition (Fade In at start, Fade Out at end)
  const sceneOpacity = interpolate(
    frame,
    [0, 8, duration - 8, duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center max-w-6xl mx-auto py-1"
      style={{ opacity: sceneOpacity }}
    >
      {/* Large Immersive Window Container */}
      <div className="w-full h-[620px] max-h-[88vh] flex shadow-2xl">
        <WindowChrome
          theme={theme}
          filename={scene.filename}
          isTerminal={scene.type === 'terminal'}
        >
          {scene.type === 'editor' ? (
            <CodeEditor
              code={scene.code || ''}
              language={scene.language || 'python'}
              theme={theme}
              highlightLines={scene.highlightLines}
              zoomScale={scene.zoomScale || 1.05}
              focusLine={scene.focusLine || 1}
              durationInFrames={duration}
            />
          ) : (
            <Terminal
              command={scene.command}
              output={scene.output}
              durationInFrames={duration}
            />
          )}
        </WindowChrome>
      </div>

      {/* Subtitles Overlay */}
      {showSubtitles && (
        <Subtitles
          text={scene.speakerScript}
          durationInFrames={duration}
        />
      )}
    </div>
  );
};

export const MainComposition: React.FC<MainCompositionProps> = ({
  storyboard,
  showSubtitles = true
}) => {
  const theme = storyboard.theme || 'one-dark';
  const cfg = THEME_CONFIGS[theme] || THEME_CONFIGS['one-dark'];

  // Calculate non-overlapping offsets for each scene
  const sceneSchedule = useMemo(() => {
    let current = 0;
    return storyboard.scenes.map((scene) => {
      const from = current;
      current += scene.durationInFrames;
      return {
        scene,
        from,
        duration: scene.durationInFrames
      };
    });
  }, [storyboard.scenes]);

  return (
    <AbsoluteFill
      className="flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none font-sans"
      style={{
        backgroundColor: cfg.bg,
        backgroundImage: `radial-gradient(circle at 50% 20%, ${cfg.accentColor}25 0%, transparent 68%), radial-gradient(circle at 85% 85%, #6366f120 0%, transparent 55%)`
      }}
    >
      {/* Decorative Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Dynamic Non-overlapping Sequences */}
      {sceneSchedule.map(({ scene, from, duration }) => (
        <Sequence key={scene.id} from={from} durationInFrames={duration}>
          <SceneItem
            scene={scene}
            theme={theme}
            duration={duration}
            showSubtitles={showSubtitles}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
