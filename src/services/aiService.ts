import { Storyboard, EditorTheme, AspectRatio } from '../types';
import { callGeminiApi } from './geminiService';
import { convertUserCodeToStoryboard } from './codeParserService';
import { generateSmartOfflineDemo } from './offlineSynthesizer';
import { PRESET_TEMPLATES } from '../constants/presets';

export { PRESET_TEMPLATES, callGeminiApi, convertUserCodeToStoryboard, generateSmartOfflineDemo };

/**
 * Main Facade for Generating Storyboards
 */
export async function generateStoryboardWithAI(
  prompt: string,
  apiKey?: string,
  language: string = 'python',
  theme: EditorTheme = 'one-dark',
  aspectRatio: AspectRatio = '16:9'
): Promise<{ storyboard: Storyboard; source: 'gemini-ai' | 'smart-offline' | 'code-parser' }> {
  const trimmed = prompt.trim();
  const isLikelyCode =
    trimmed.includes('def ') ||
    trimmed.includes('function ') ||
    trimmed.includes('import ') ||
    trimmed.includes('const ') ||
    trimmed.includes('class ') ||
    trimmed.includes('for ') ||
    trimmed.includes('while ') ||
    trimmed.includes('if ') ||
    trimmed.includes('"""') ||
    trimmed.includes("'''") ||
    trimmed.split('\n').length >= 4;

  // 1. If API Key is present -> Call Google Gemini Live AI
  if (apiKey && apiKey.trim()) {
    try {
      const sb = await callGeminiApi(prompt, apiKey.trim(), language, theme, aspectRatio);
      return { storyboard: sb, source: 'gemini-ai' };
    } catch (err: any) {
      const errMsg = err.message || '';
      // If fatal auth error (leaked, invalid key) -> throw so user can fix their key
      if (errMsg.includes('leaked') || errMsg.includes('API_KEY_INVALID') || errMsg.includes('PERMISSION_DENIED')) {
        throw new Error(`[Gemini AI Error] ${errMsg}`);
      }
      
      // If server overload / high demand / timeout -> gracefully fallback to local synthesizer
      console.warn('Google AI is busy or timed out, activating smart local engine:', errMsg);
      if (isLikelyCode) {
        const sb = convertUserCodeToStoryboard(prompt, language, theme, aspectRatio);
        return { storyboard: sb, source: 'code-parser' };
      }
      const sb = generateSmartOfflineDemo(prompt, language, theme, aspectRatio);
      return { storyboard: sb, source: 'smart-offline' };
    }
  }

  // 2. Offline Mode (No API Key): If user pasted code -> Use dynamic syntax parser
  if (isLikelyCode) {
    const sb = convertUserCodeToStoryboard(prompt, language, theme, aspectRatio);
    return { storyboard: sb, source: 'code-parser' };
  }

  // 3. Offline Mode (No API Key): Prompt synthesizer
  const sb = generateSmartOfflineDemo(prompt, language, theme, aspectRatio);
  return { storyboard: sb, source: 'smart-offline' };
}
