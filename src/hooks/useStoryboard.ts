import { useState, useCallback } from 'react';
import { Storyboard, EditorTheme, AspectRatio, SpeedMode } from '../types';
import { PRESET_TEMPLATES } from '../constants/presets';

export function useStoryboard() {
  const [storyboard, setStoryboard] = useState<Storyboard>(PRESET_TEMPLATES['quicksort-python']);
  const [speedMode, setSpeedMode] = useState<SpeedMode>('normal');

  const updateSpeedMode = useCallback((newSpeed: SpeedMode) => {
    setSpeedMode(newSpeed);
    const speedMultipliers: Record<SpeedMode, number> = {
      slow: 1.6,
      relaxed: 1.25,
      normal: 1.0,
      fast: 0.7
    };

    setStoryboard((prev) => {
      const factor = speedMultipliers[newSpeed] / (speedMultipliers[prev.speedMode || 'normal'] || 1.0);
      const updatedScenes = prev.scenes.map((sc) => ({
        ...sc,
        durationInFrames: Math.max(120, Math.round(sc.durationInFrames * factor))
      }));
      return {
        ...prev,
        speedMode: newSpeed,
        scenes: updatedScenes
      };
    });
  }, []);

  const updateTheme = useCallback((theme: EditorTheme) => {
    setStoryboard((prev) => ({ ...prev, theme }));
  }, []);

  const updateAspectRatio = useCallback((aspectRatio: AspectRatio) => {
    setStoryboard((prev) => ({ ...prev, aspectRatio }));
  }, []);

  const loadPreset = useCallback((presetKey: string) => {
    if (PRESET_TEMPLATES[presetKey]) {
      const preset = { ...PRESET_TEMPLATES[presetKey] };
      setStoryboard(preset);
      return preset;
    }
    return null;
  }, []);

  return {
    storyboard,
    setStoryboard,
    speedMode,
    updateSpeedMode,
    updateTheme,
    updateAspectRatio,
    loadPreset
  };
}
