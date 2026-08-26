import { Storyboard, Scene, EditorTheme, AspectRatio } from '../types';
import { computeSmartHighlights } from '../utils/syntaxScorer';

/**
 * Intelligent Syntax-Aware Code-to-Storyboard Parser
 */
export function convertUserCodeToStoryboard(
  rawCode: string,
  language: string,
  theme: EditorTheme,
  aspectRatio: AspectRatio
): Storyboard {
  const lines = rawCode.trim().split('\n');
  const totalLines = lines.length;
  const ext = language === 'python' ? 'py' : language === 'typescript' ? 'ts' : 'js';
  const filename = `main.${ext}`;

  // 1. Semantic Block Segmentation
  const breakpoints: number[] = [0];

  for (let i = 1; i < totalLines; i++) {
    const line = lines[i];
    const prevLine = lines[i - 1];
    const trimmed = line.trim();

    if (i < 2) continue;

    const isFunctionDef = /^(async\s+)?(def\s+|function\s+|export\s+(const|function|class)\s+|const\s+\w+\s*=\s*(async\s*)?\()/.test(trimmed);
    const isClassDef = /^(class\s+|export\s+class\s+)/.test(trimmed);
    const isMajorControlFlow = /^(for\s+|while\s+|try:|if\s+__name__)/.test(trimmed);
    const isMajorCommentHeader = /^(#|\/\/|\/\*)\s*={3,}/.test(trimmed) || /^(#|\/\/)\s*(Phần|Step|Bước|Cài đặt|Khởi tạo|Thực thi|Demo)/i.test(trimmed);
    const isBlankSeparator = prevLine.trim() === '' && trimmed.length > 0 && !trimmed.startsWith(' ') && !trimmed.startsWith('\t');

    if (isFunctionDef || isClassDef || isMajorControlFlow || isMajorCommentHeader || isBlankSeparator) {
      if (i - breakpoints[breakpoints.length - 1] >= 4) {
        breakpoints.push(i);
      }
    }
  }

  // Fallback chunking if code is linear
  if (breakpoints.length <= 1) {
    const targetChunkSize = Math.max(5, Math.min(10, Math.ceil(totalLines / 3)));
    let currentIdx = targetChunkSize;
    while (currentIdx < totalLines - 2) {
      breakpoints.push(currentIdx);
      currentIdx += targetChunkSize;
    }
  }

  // Ensure last breakpoint covers the whole code
  if (breakpoints[breakpoints.length - 1] !== totalLines) {
    breakpoints.push(totalLines);
  }

  // 2. Build progressive scenes
  const scenes: Scene[] = [];
  let prevAccumulatedLineCount = 0;

  for (let b = 1; b < breakpoints.length; b++) {
    const startLineIdx = breakpoints[b - 1];
    const endLineIdx = breakpoints[b];
    const chunkLines = lines.slice(startLineIdx, endLineIdx);
    const startTypingFromLine = prevAccumulatedLineCount + 1;
    const fullCodeUpToNow = lines.slice(0, endLineIdx).join('\n');

    const { highlightLines, focusLine } = computeSmartHighlights(chunkLines, startTypingFromLine);

    // Generate intelligent Vietnamese narration
    const chunkText = chunkLines.join('\n');
    let title = `Phân đoạn ${b}: Triển khai mã nguồn`;
    let narration = `Trong phân cảnh này, chúng ta tiến hành viết ${chunkLines.length} dòng mã nguồn tiếp theo.`;

    if (b === 1) {
      if (chunkText.includes('import ') || chunkText.includes('require(')) {
        title = 'Khai báo Thư viện & Cấu hình ban đầu';
        narration = `Đầu tiên, chúng ta tiến hành import các module cần thiết và cấu hình các hằng số nền tảng phục vụ cho toàn bộ chương trình.`;
      } else if (chunkText.includes('def ') || chunkText.includes('class ') || chunkText.includes('function ')) {
        title = 'Khởi tạo Cấu trúc & Định nghĩa Hàm';
        narration = `Chúng ta bắt đầu bằng việc khởi tạo cấu trúc hàm xử lý chính, nhận các tham số đầu vào và thiết lập phạm vi biến cục bộ.`;
      } else {
        title = 'Khởi tạo Dữ liệu & Thiết lập Biến';
        narration = `Đầu tiên, chúng ta khởi tạo các biến lưu trữ và chuẩn bị dữ liệu đầu vào cho bài toán.`;
      }
    } else {
      if (chunkText.includes('for ') || chunkText.includes('while ')) {
        title = `Vòng lặp & Duyệt phần tử (Dòng ${startTypingFromLine} - ${endLineIdx})`;
        narration = `Tiếp tục triển khai vòng lặp để duyệt qua từng phần tử, kiểm tra điều kiện và thực thi các thao tác biến đổi dữ liệu theo yêu cầu thuật toán.`;
      } else if (chunkText.includes('return ')) {
        title = `Xử lý Kết quả & Trả về Giá trị (Dòng ${startTypingFromLine} - ${endLineIdx})`;
        narration = `Tại bước này, hàm xử lý hoàn tất các phép toán cuối cùng và trả về kết quả chuẩn hóa cho chương trình gọi nó.`;
      } else if (chunkText.includes('print(') || chunkText.includes('console.log(')) {
        title = `In ấn & Kiểm chứng Trực tiếp (Dòng ${startTypingFromLine} - ${endLineIdx})`;
        narration = `Chúng ta gọi các hàm in để hiển thị thông tin debug và kiểm tra tính chính xác của các biến trong quá trình chạy.`;
      } else {
        title = `Cài đặt Logic Chi tiết (Dòng ${startTypingFromLine} - ${endLineIdx})`;
        narration = `Tiến hành lập trình các biểu thức tính toán, gọi hàm xử lý phụ trợ và cập nhật trạng thái dữ liệu.`;
      }
    }

    const duration = Math.max(210, Math.min(390, chunkLines.length * 28 + 120));

    scenes.push({
      id: `parsed-scene-${b}`,
      type: 'editor',
      title,
      filename,
      language,
      code: fullCodeUpToNow,
      startTypingFromLine,
      highlightLines,
      zoomScale: b === 1 ? 1.08 : 1.15,
      focusLine,
      speakerScript: narration,
      durationInFrames: duration
    });

    prevAccumulatedLineCount = endLineIdx;
  }

  // 3. Add Final Terminal Verification Scene
  const runCmd = language === 'python' ? `python ${filename}` : `node ${filename}`;
  scenes.push({
    id: 'parsed-scene-terminal',
    type: 'terminal',
    title: 'Thực thi & Kiểm chứng Kết quả trên Terminal',
    command: runCmd,
    output: `>> [ScriptCode Studio] Đang thực thi ${filename}...\n>> [SUCCESS] Quá trình chạy mã nguồn hoàn thành không lỗi!\n>> Kết quả kiểm tra dữ liệu: OK.`,
    speakerScript: `Cuối cùng, chúng ta mở cửa sổ Terminal và chạy lệnh ${runCmd} để kiểm chứng. Kết quả trả về chính xác tuyệt đối theo đúng logic thuật toán đã lập trình.`,
    durationInFrames: 240
  });

  return {
    title: `Demo Code: ${filename} (${totalLines} dòng)`,
    description: `Video demo tự động phân tích và tạo kịch bản từ mã nguồn thực tế (${totalLines} dòng)`,
    aspectRatio,
    theme,
    fps: 30,
    scenes
  };
}
