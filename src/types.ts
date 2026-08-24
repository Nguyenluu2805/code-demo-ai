export type AspectRatio = '16:9' | '9:16' | '1:1';

export type EditorTheme = 'vscode-dark' | 'one-dark' | 'dracula' | 'github-dark' | 'monokai';

export type SceneType = 'editor' | 'terminal' | 'split';

export type SpeedMode = 'slow' | 'relaxed' | 'normal' | 'fast';

export interface Scene {
  id: string;
  type: SceneType;
  title?: string;
  // Code editor specific
  filename?: string;
  language?: string;
  code?: string;
  highlightLines?: number[];
  zoomScale?: number; // e.g. 1.0 to 1.3
  focusLine?: number; // line number to center zoom on
  lineExplanations?: string[]; // specific explanation for each line
  // Terminal specific
  command?: string;
  output?: string;
  // Presentation & Subtitle
  speakerScript: string;
  durationInFrames: number; // calculated at 30 fps
}

export interface Storyboard {
  title: string;
  description?: string;
  aspectRatio: AspectRatio;
  theme: EditorTheme;
  fps: number;
  speedMode?: SpeedMode;
  scenes: Scene[];
}

export interface ThemeConfig {
  name: EditorTheme;
  label: string;
  bg: string;
  editorBg: string;
  headerBg: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  tabActiveBg: string;
  lineHighlightBg: string;
}

export const THEME_CONFIGS: Record<EditorTheme, ThemeConfig> = {
  'vscode-dark': {
    name: 'vscode-dark',
    label: 'VS Code Dark+',
    bg: '#18181b',
    editorBg: '#1e1e1e',
    headerBg: '#252526',
    textColor: '#d4d4d4',
    accentColor: '#007acc',
    borderColor: '#3c3c3c',
    tabActiveBg: '#1e1e1e',
    lineHighlightBg: 'rgba(255, 255, 255, 0.07)'
  },
  'one-dark': {
    name: 'one-dark',
    label: 'One Dark Pro',
    bg: '#1b1d23',
    editorBg: '#282c34',
    headerBg: '#21252b',
    textColor: '#abb2bf',
    accentColor: '#61afef',
    borderColor: '#181a1f',
    tabActiveBg: '#282c34',
    lineHighlightBg: 'rgba(97, 175, 239, 0.12)'
  },
  'dracula': {
    name: 'dracula',
    label: 'Dracula',
    bg: '#1e1f29',
    editorBg: '#282a36',
    headerBg: '#21222c',
    textColor: '#f8f8f2',
    accentColor: '#bd93f9',
    borderColor: '#44475a',
    tabActiveBg: '#282a36',
    lineHighlightBg: 'rgba(189, 147, 249, 0.15)'
  },
  'github-dark': {
    name: 'github-dark',
    label: 'GitHub Dark',
    bg: '#010409',
    editorBg: '#0d1117',
    headerBg: '#161b22',
    textColor: '#e6edf3',
    accentColor: '#2f81f7',
    borderColor: '#30363d',
    tabActiveBg: '#0d1117',
    lineHighlightBg: 'rgba(56, 139, 253, 0.12)'
  },
  'monokai': {
    name: 'monokai',
    label: 'Monokai Pro',
    bg: '#19181a',
    editorBg: '#221f22',
    headerBg: '#2d2a2e',
    textColor: '#fcfcfa',
    accentColor: '#ffd866',
    borderColor: '#403e41',
    tabActiveBg: '#221f22',
    lineHighlightBg: 'rgba(255, 216, 102, 0.12)'
  }
};
