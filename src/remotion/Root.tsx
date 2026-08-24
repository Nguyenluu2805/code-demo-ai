import React from 'react';
import { Composition } from 'remotion';
import { MainComposition } from './Composition';
import { PRESET_TEMPLATES } from '../services/aiService';
import { Storyboard } from '../types';

export const RemotionRoot: React.FC = () => {
  const defaultStoryboard = PRESET_TEMPLATES['quicksort-python'];

  return (
    <>
      <Composition
        id="CodeDemo"
        component={MainComposition as any}
        durationInFrames={defaultStoryboard.scenes.reduce((acc, s) => acc + s.durationInFrames, 0)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          storyboard: defaultStoryboard,
          showSubtitles: true
        }}
        calculateMetadata={({ props }) => {
          const sb: Storyboard = (props as any)?.storyboard || defaultStoryboard;
          const isPortrait = sb.aspectRatio === '9:16';
          const totalFrames = Math.max(
            30,
            sb.scenes?.reduce((acc, s) => acc + s.durationInFrames, 0) || 300
          );
          return {
            durationInFrames: totalFrames,
            fps: sb.fps || 30,
            width: isPortrait ? 1080 : 1920,
            height: isPortrait ? 1920 : 1080,
            props
          };
        }}
      />
    </>
  );
};
