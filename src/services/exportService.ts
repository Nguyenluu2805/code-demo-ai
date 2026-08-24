import { Storyboard } from '../types';

/**
 * Converts frames to SRT timestamp format (HH:MM:SS,mmm)
 */
function framesToSrtTime(frames: number, fps: number): string {
  const totalSeconds = frames / fps;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 1000);

  const pad = (num: number, size: number = 2) => String(num).padStart(size, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(milliseconds, 3)}`;
}

/**
 * Converts frames to Markdown display time (MM:SS)
 */
function framesToDisplayTime(frames: number, fps: number): string {
  const totalSeconds = Math.floor(frames / fps);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Generates standard SRT subtitle string from Storyboard
 */
export function generateSrtContent(storyboard: Storyboard): string {
  let srt = '';
  let currentFrame = 0;

  storyboard.scenes.forEach((scene, index) => {
    const startFrame = currentFrame;
    const endFrame = currentFrame + scene.durationInFrames;
    currentFrame = endFrame;

    if (!scene.speakerScript || scene.speakerScript.trim() === '') return;

    const startTime = framesToSrtTime(startFrame, storyboard.fps);
    const endTime = framesToSrtTime(endFrame, storyboard.fps);

    srt += `${index + 1}\n`;
    srt += `${startTime} --> ${endTime}\n`;
    srt += `${scene.speakerScript.trim()}\n\n`;
  });

  return srt;
}

/**
 * Generates formatted Markdown speaker script
 */
export function generateMarkdownScript(storyboard: Storyboard): string {
  let md = `# Kịch Bản Thuyết Trình: ${storyboard.title}\n\n`;
  if (storyboard.description) {
    md += `> ${storyboard.description}\n\n`;
  }
  md += `**Thời lượng ước tính:** ~${Math.round(storyboard.scenes.reduce((acc, s) => acc + s.durationInFrames, 0) / storyboard.fps)} giây\n`;
  md += `**Tỷ lệ khung hình:** ${storyboard.aspectRatio} | **Theme:** ${storyboard.theme}\n\n`;
  md += `---\n\n## Danh Sách Phân Cảnh & Lời Thoại\n\n`;

  let currentFrame = 0;
  storyboard.scenes.forEach((scene, index) => {
    const startFrame = currentFrame;
    const endFrame = currentFrame + scene.durationInFrames;
    const startTimeStr = framesToDisplayTime(startFrame, storyboard.fps);
    const endTimeStr = framesToDisplayTime(endFrame, storyboard.fps);
    currentFrame = endFrame;

    md += `### Phân cảnh ${index + 1}: ${scene.title || (scene.type === 'terminal' ? 'Chạy Terminal' : 'Mã nguồn ' + (scene.filename || 'Code'))}\n`;
    md += `- **Mốc thời gian:** \`[${startTimeStr} - ${endTimeStr}]\` (${(scene.durationInFrames / storyboard.fps).toFixed(1)}s)\n`;
    md += `- **Loại:** \`${scene.type.toUpperCase()}\`${scene.filename ? ` | **File:** \`${scene.filename}\`` : ''}\n\n`;

    md += `🎙️ **Lời thuyết minh / Speaker Script:**\n`;
    md += `> *"${scene.speakerScript}"*\n\n`;

    if (scene.type === 'editor' && scene.code) {
      md += `💻 **Nội dung code hiển thị:**\n\`\`\`${scene.language || 'text'}\n${scene.code}\n\`\`\`\n`;
      if (scene.highlightLines && scene.highlightLines.length > 0) {
        md += `✨ *Dòng highlight tập trung:* \`${scene.highlightLines.join(', ')}\`\n`;
      }
    } else if (scene.type === 'terminal') {
      md += `💻 **Lệnh thực thi:** \`${scene.command}\`\n`;
      if (scene.output) {
        md += `📋 **Kết quả:**\n\`\`\`bash\n${scene.output}\n\`\`\`\n`;
      }
    }

    md += `\n---\n\n`;
  });

  return md;
}

/**
 * Triggers file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
