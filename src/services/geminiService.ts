import { Storyboard, EditorTheme, AspectRatio } from '../types';
import { cleanAndParseJson } from '../utils/jsonHelper';

/**
 * Call Gemini API to generate intelligent dynamic storyboards with live discovery and timeout failover
 */
export async function callGeminiApi(
  prompt: string,
  apiKey: string,
  language: string,
  theme: EditorTheme,
  aspectRatio: AspectRatio
): Promise<Storyboard> {
  const systemPrompt = `Bạn là một đạo diễn video kỹ thuật và chuyên gia lập trình cấp cao của ScriptCode Studio.
Nhiệm vụ: Chuyển đổi yêu cầu "${prompt}" thành một Storyboard Video Demo code hoàn chỉnh dạng JSON.

QUY TẮC QUAN TRỌNG VỀ PHÂN CẢNH VÀ MÃ NGUỒN:
1. ĐẦY ĐỦ NỘI DUNG (NO TRUNCATION): Tuyệt đối không được cắt xén, viết tắt "..." hoặc bỏ sót logic. Toàn bộ mã nguồn phải hoạt động được và đầy đủ cú pháp.
2. PHÂN CẢNH TĂNG TIẾN (PROGRESSIVE CODING): Tùy vào độ dài và độ phức tạp, chia thành từ 2 đến 6+ phân cảnh code + 1 cảnh terminal. 
   - Cảnh sau sẽ kế thừa mã nguồn của cảnh trước (được ghi nhận qua startTypingFromLine: chỉ số dòng bắt đầu gõ mới). Các dòng trước startTypingFromLine sẽ xuất hiện sẵn mà không tốn thời gian gõ lại.
3. HIGHLIGHT & FOCUS TRỌNG TÂM: Mảng highlightLines PHẢI chọn đúng 2-4 dòng lệnh quan trọng nhất (gán biến, gọi hàm, return, if/while), TUYỆT ĐỐI KHÔNG highlight dòng comment hay dòng trắng. focusLine là dòng trọng tâm nhất để camera căn giữa.
4. LỜI THUYẾT MINH (speakerScript): Phải là một đoạn văn đầy đủ, giàu kiến thức (3 đến 5 câu chi tiết tiếng Việt), giải thích cặn kẽ từng dòng lệnh mới được viết trong phân cảnh đó.
5. PHÂN CẢNH CUỐI (TERMINAL): Luôn có ít nhất 1 phân cảnh type="terminal" để chạy thử nghiệm và in ra kết quả kiểm chứng.

Chỉ trả về DUY NHẤT một JSON hợp lệ tuân thủ schema:
{
  "title": "Tiêu đề video",
  "description": "Mô tả ngắn gọn",
  "aspectRatio": "${aspectRatio}",
  "theme": "${theme}",
  "fps": 30,
  "scenes": [
    {
      "id": "scene-1",
      "type": "editor",
      "title": "Tiêu đề cảnh 1",
      "filename": "main.${language === 'python' ? 'py' : language === 'typescript' ? 'ts' : 'js'}",
      "language": "${language}",
      "code": "mã nguồn cảnh 1...",
      "startTypingFromLine": 1,
      "highlightLines": [1, 2],
      "zoomScale": 1.1,
      "focusLine": 1,
      "speakerScript": "Đoạn văn thuyết minh 3-5 câu giải thích chi tiết logic...",
      "durationInFrames": 300
    },
    {
      "id": "scene-final",
      "type": "terminal",
      "title": "Chạy thử kết quả",
      "command": "${language === 'python' ? 'python main.py' : 'node main.js'}",
      "output": "kết quả in ra terminal...",
      "speakerScript": "Đoạn văn phân tích kết quả...",
      "durationInFrames": 240
    }
  ]
}`;

  const cleanKey = apiKey.trim();
  let candidateModels: string[] = [];

  // 1. Dynamic Discovery: Get available models with 8s timeout
  try {
    const listController = new AbortController();
    const listTimeout = setTimeout(() => listController.abort(), 8000);
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`, {
      signal: listController.signal
    });
    clearTimeout(listTimeout);

    if (listRes.ok) {
      const listData = await listRes.json();
      if (Array.isArray(listData.models)) {
        const usable = listData.models
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name);
        
        usable.sort((a: string, b: string) => {
          if (a.includes('flash') && !b.includes('flash')) return -1;
          if (!a.includes('flash') && b.includes('flash')) return 1;
          return 0;
        });

        candidateModels = usable;
      }
    } else {
      const errData = await listRes.json().catch(() => ({}));
      const message = errData.error?.message || `HTTP ${listRes.status}: Lỗi xác thực Google AI`;
      if (listRes.status === 400 || listRes.status === 403) {
        throw new Error(message);
      }
    }
  } catch (err: any) {
    if (err.message && (err.message.includes('API key') || err.message.includes('leaked') || err.message.includes('PERMISSION_DENIED'))) {
      throw err;
    }
  }

  if (candidateModels.length === 0) {
    candidateModels = ['models/gemini-1.5-flash', 'models/gemini-pro', 'models/gemini-2.0-flash'];
  }

  let lastErrorMsg = '';

  for (const modelPath of candidateModels.slice(0, 3)) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000); // 40s generous timeout

    try {
      const isAdvancedModel = modelPath.includes('1.5') || modelPath.includes('2.') || modelPath.includes('3.');
      const url = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${cleanKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nYêu cầu tạo video: ${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: isAdvancedModel ? 'application/json' : undefined
          }
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error?.message || `HTTP ${response.status} lỗi kết nối`;

        if (
          (response.status === 400 || response.status === 403) &&
          (message.includes('API key') || message.includes('leaked') || message.includes('PERMISSION_DENIED'))
        ) {
          throw new Error(message);
        }

        lastErrorMsg = message;
        continue;
      }

      const data = await response.json();
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textContent) {
        lastErrorMsg = 'Gemini API không phản hồi dữ liệu văn bản';
        continue;
      }

      const storyboard = cleanAndParseJson<Storyboard>(textContent);
      storyboard.theme = theme;
      storyboard.aspectRatio = aspectRatio;
      storyboard.fps = 30;

      return storyboard;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        lastErrorMsg = 'Yêu cầu tới Google AI Studio quá thời gian chờ (Timeout). Vui lòng thử lại.';
      } else if (
        err.message &&
        (err.message.includes('API key') ||
          err.message.includes('leaked') ||
          err.message.includes('Quota') ||
          err.message.includes('PERMISSION_DENIED'))
      ) {
        throw err;
      } else {
        lastErrorMsg = err.message || 'Lỗi kết nối tới Google AI';
      }
    }
  }

  throw new Error(lastErrorMsg || 'Không thể tạo kịch bản từ Gemini AI. Vui lòng thử lại sau.');
}
