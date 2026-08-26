import { Storyboard, Scene, AspectRatio, EditorTheme } from '../types';

/**
 * Robust JSON parser that handles markdown codeblocks, trailing commas, and escaped characters from LLMs
 */
function cleanAndParseJson<T>(raw: string): T {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  // Remove trailing commas
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

  try {
    return JSON.parse(cleaned) as T;
  } catch (err: any) {
    // Attempt fallback sanitization for control characters in strings
    const sanitized = cleaned.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');
    return JSON.parse(sanitized) as T;
  }
}

/**
 * Validates a Gemini API Key directly against Google ModelService and returns the active model
 */
export async function validateGeminiApiKey(
  apiKey: string
): Promise<{ valid: boolean; model?: string; error?: string }> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) return { valid: false, error: 'Vui lòng nhập API Key' };

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { valid: false, error: data.error?.message || `HTTP ${res.status}: Lỗi xác thực Google AI` };
    }
    if (Array.isArray(data.models)) {
      const usable = data.models
        .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m: any) => m.name.replace(/^models\//, ''));
      const activeModel = usable.find((m: string) => m.includes('flash')) || usable[0] || 'gemini-1.5-flash';
      return { valid: true, model: activeModel };
    }
    return { valid: true, model: 'gemini-1.5-flash' };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Không thể kết nối đến Google AI Studio. Vui lòng kiểm tra mạng.' };
  }
}

export const PRESET_TEMPLATES: Record<string, Storyboard> = {
  'quicksort-python': {
    title: 'Giải thuật QuickSort bằng Python',
    description: 'Demo cài đặt thuật toán sắp xếp nhanh QuickSort và chạy thử nghiệm kết quả.',
    aspectRatio: '16:9',
    theme: 'one-dark',
    fps: 30,
    scenes: [
      {
        id: 'scene-1',
        type: 'editor',
        title: 'Khai báo hàm và điều kiện dừng',
        filename: 'quicksort.py',
        language: 'python',
        code: `def quicksort(arr):
    # Trường hợp cơ sở: mảng <= 1 phần tử đã được sắp xếp
    if len(arr) <= 1:
        return arr`,
        startTypingFromLine: 1,
        highlightLines: [3, 4],
        zoomScale: 1.1,
        focusLine: 4,
        speakerScript: "Đầu tiên, chúng ta khai báo hàm quicksort nhận vào danh sách arr. Ở dòng 3 và 4, ta xử lý trường hợp cơ sở: nếu mảng có từ 1 phần tử trở xuống thì trả về ngay chính nó vì mảng đã được sắp xếp sẵn.",
        durationInFrames: 270
      },
      {
        id: 'scene-2',
        type: 'editor',
        title: 'Chọn Pivot và phân hoạch mảng',
        filename: 'quicksort.py',
        language: 'python',
        code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)`,
        startTypingFromLine: 5,
        highlightLines: [5, 6, 7, 8, 10],
        zoomScale: 1.15,
        focusLine: 6,
        speakerScript: "Tiếp theo, ta chọn phần tử Pivot ở giữa mảng. Dùng list comprehension để chia mảng thành 3 nhóm: các số nhỏ hơn Pivot đưa vào mảng left, bằng Pivot đưa vào middle, và lớn hơn Pivot đưa vào right. Sau đó gọi đệ quy sắp xếp và gộp lại.",
        durationInFrames: 330
      },
      {
        id: 'scene-3',
        type: 'terminal',
        title: 'Chạy thử nghiệm trên Terminal',
        command: 'python quicksort.py',
        output: `>> arr = [38, 27, 43, 3, 9, 82, 10]
>> print("Mảng đã sắp xếp:", quicksort(arr))
[SUCCESS] Mảng đã sắp xếp: [3, 9, 10, 27, 38, 43, 82]`,
        speakerScript: "Cuối cùng, chúng ta chạy thử nghiệm trên terminal với mảng số ngẫu nhiên. Thuật toán phân hoạch đệ quy nhanh chóng trả về mảng được sắp xếp tăng dần chính xác.",
        durationInFrames: 210
      }
    ]
  },
  'binary-search': {
    title: 'Thuật toán Binary Search trong Python',
    description: 'Tìm kiếm nhị phân trên mảng đã sắp xếp với độ phức tạp O(log n)',
    aspectRatio: '16:9',
    theme: 'one-dark',
    fps: 30,
    scenes: [
      {
        id: 'bs-1',
        type: 'editor',
        title: 'Khởi tạo hai con trỏ Left và Right',
        filename: 'binary_search.py',
        language: 'python',
        code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2`,
        startTypingFromLine: 1,
        highlightLines: [2, 4, 5],
        zoomScale: 1.1,
        focusLine: 2,
        speakerScript: "Thuật toán tìm kiếm nhị phân yêu cầu mảng đã sắp xếp. Đầu tiên, chúng ta thiết lập 2 con trỏ left tại vị trí 0 và right ở cuối mảng. Vòng lặp while sẽ chạy liên tục chừng nào left chưa vượt quá right, và tính toán vị trí chỉ số ở giữa mid.",
        durationInFrames: 270
      },
      {
        id: 'bs-2',
        type: 'editor',
        title: 'So sánh phần tử giữa Mid và Target',
        filename: 'binary_search.py',
        language: 'python',
        code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`,
        startTypingFromLine: 6,
        highlightLines: [6, 7, 8, 9, 10, 11],
        zoomScale: 1.15,
        focusLine: 7,
        speakerScript: "Tại mỗi bước, ta so sánh phần tử ở giữa arr[mid] với target. Nếu bằng target thì tìm thấy và trả về vị trí mid ngay. Nếu nhỏ hơn target thì dịch left = mid + 1, ngược lại nếu lớn hơn thì thu hẹp right = mid - 1. Nếu hết vòng lặp không thấy thì trả về -1.",
        durationInFrames: 330
      },
      {
        id: 'bs-3',
        type: 'terminal',
        title: 'Test thử nghiệm tìm kiếm',
        command: 'python binary_search.py',
        output: `>> numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
>> target = 23
>> index = binary_search(numbers, target)
[SUCCESS] Tìm thấy target 23 tại vị trí index: 5 (chỉ sau 3 bước so sánh!)`,
        speakerScript: "Chạy thử với mảng 10 phần tử và số cần tìm là 23. Nhờ chia đôi không gian tìm kiếm ở mỗi bước, thuật toán chỉ mất đúng 3 lần so sánh là tìm ra kết quả chính xác!",
        durationInFrames: 210
      }
    ]
  },
  'react-counter': {
    title: 'Custom Hook useCounter trong React',
    description: 'Xây dựng custom hook quản lý bộ đếm với TypeScript',
    aspectRatio: '16:9',
    theme: 'dracula',
    fps: 30,
    scenes: [
      {
        id: 'sc-1',
        type: 'editor',
        title: 'Khởi tạo State và Hook',
        filename: 'useCounter.ts',
        language: 'typescript',
        code: `import { useState, useCallback } from 'react';

export const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState<number>(initialValue);`,
        startTypingFromLine: 1,
        highlightLines: [1, 3, 4],
        zoomScale: 1.1,
        focusLine: 4,
        speakerScript: "Để xây dựng custom hook useCounter trong React với TypeScript, chúng ta import useState và useCallback. Khai báo hook nhận vào tham số initialValue mặc định là 0 và khởi tạo biến state count.",
        durationInFrames: 270
      },
      {
        id: 'sc-2',
        type: 'editor',
        title: 'Định nghĩa các hàm cập nhật State',
        filename: 'useCounter.ts',
        language: 'typescript',
        code: `import { useState, useCallback } from 'react';

export const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState<number>(initialValue);

  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
};`,
        startTypingFromLine: 6,
        highlightLines: [6, 7, 8, 10],
        zoomScale: 1.15,
        focusLine: 7,
        speakerScript: "Tiếp theo, ta định nghĩa ba hàm điều khiển: increment tăng 1, decrement giảm 1, và reset đưa về giá trị ban đầu. Tất cả được bọc bằng useCallback để tối ưu hiệu năng render của React trước khi trả về object.",
        durationInFrames: 330
      },
      {
        id: 'sc-3',
        type: 'terminal',
        title: 'Kiểm thử Custom Hook',
        command: 'npm test useCounter.test.ts',
        output: `PASS src/hooks/useCounter.test.ts
✓ should initialize counter with 0 (4 ms)
✓ should increment and decrement correctly (2 ms)
✓ should reset to initial value (2 ms)
Test Suites: 1 passed, 1 total`,
        speakerScript: "Chạy thử nghiệm Jest test suite cho hook useCounter. Tất cả các test case tăng, giảm và reset đều vượt qua hoàn hảo!",
        durationInFrames: 210
      }
    ]
  },
  'express-jwt-api': {
    title: 'Xác thực JWT Middleware trong Express API',
    description: 'Xây dựng middleware bảo mật Endpoint REST API với JsonWebToken',
    aspectRatio: '16:9',
    theme: 'github-dark',
    fps: 30,
    scenes: [
      {
        id: 'jwt-1',
        type: 'editor',
        title: 'Lấy token từ Header và kiểm tra',
        filename: 'auth.middleware.js',
        language: 'javascript',
        code: `const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Truy cập bị từ chối: Thiếu Token!' });
  }`,
        startTypingFromLine: 1,
        highlightLines: [4, 5, 8],
        zoomScale: 1.1,
        focusLine: 5,
        speakerScript: "Trong Express, middleware xác thực sẽ đọc header Authorization từ request của client và tách chuỗi Bearer token. Nếu client không gửi token, ta lập tức ngắt kết nối và trả về mã lỗi 401 Unauthorized.",
        durationInFrames: 270
      },
      {
        id: 'jwt-2',
        type: 'editor',
        title: 'Verify Token và gắn User vào Request',
        filename: 'auth.middleware.js',
        language: 'javascript',
        code: `const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Truy cập bị từ chối: Thiếu Token!' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn!' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;`,
        startTypingFromLine: 11,
        highlightLines: [11, 12, 13, 14],
        zoomScale: 1.15,
        focusLine: 12,
        speakerScript: "Nếu có token, ta dùng hàm jwt.verify cùng bí mật ACCESS_TOKEN_SECRET để kiểm tra tính hợp lệ. Khi token chuẩn xác, thông tin user được gắn trực tiếp vào req.user và gọi next() để tiếp tục xử lý router.",
        durationInFrames: 330
      },
      {
        id: 'jwt-3',
        type: 'terminal',
        title: 'Thử nghiệm gọi API với cURL',
        command: 'curl -H "Authorization: Bearer valid_token_xyz" http://localhost:5000/api/profile',
        output: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "success",
  "user": { "id": 1024, "username": "alex_dev", "role": "admin" },
  "message": "Xác thực danh tính thành công qua JWT Token!"
}`,
        speakerScript: "Gửi request kiểm thử có kèm Bearer token qua curl, server phản hồi mã 200 OK cùng dữ liệu người dùng được xác thực thành công!",
        durationInFrames: 210
      }
    ]
  }
};

/**
 * Intelligent Highlight & Focus Extractor:
 * Identifies the most critical operational statements in a code chunk,
 * ignoring comments, empty lines, and docstrings.
 */
function extractSmartHighlightLines(chunkLines: string[], startTypingFromLine: number): { highlightLines: number[]; focusLine: number } {
  const scoredLines: { lineNum: number; score: number }[] = [];
  let inDocstring = false;

  chunkLines.forEach((lineText, idx) => {
    const lineNum = startTypingFromLine + idx;
    const trimmed = lineText.trim();

    if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
      inDocstring = !inDocstring;
      return;
    }
    if (inDocstring) return;

    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    let score = 1;
    // Imports
    if (trimmed.startsWith('import ') || trimmed.startsWith('from ') || trimmed.startsWith('require(')) score += 4;
    // Method invocations (e.g. .append, .insert, .split)
    if (/\.[a-zA-Z_]\w*\(/.test(trimmed)) score += 5;
    // Assignments (e.g. so_list = [...])
    if (/^[a-zA-Z_]\w*\s*=\s*/.test(trimmed)) score += 4;
    // Function definition
    if (trimmed.startsWith('def ') || trimmed.startsWith('class ') || trimmed.startsWith('function ') || trimmed.startsWith('export const ')) score += 4;
    // Print / logging
    if (trimmed.startsWith('print(') || trimmed.startsWith('console.log(') || trimmed.startsWith('line(')) score += 3;
    // Control flow / return
    if (trimmed.startsWith('return ') || trimmed.startsWith('if ') || trimmed.startsWith('for ') || trimmed.startsWith('while ')) score += 4;

    scoredLines.push({ lineNum, score });
  });

  if (scoredLines.length === 0) {
    chunkLines.forEach((l, idx) => {
      if (l.trim().length > 0) scoredLines.push({ lineNum: startTypingFromLine + idx, score: 1 });
    });
  }

  scoredLines.sort((a, b) => b.score - a.score);

  const topLines = scoredLines.slice(0, 4).map((l) => l.lineNum).sort((a, b) => a - b);
  const focusLine = topLines.length > 0 ? topLines[Math.floor(topLines.length / 2)] : startTypingFromLine;

  return { highlightLines: topLines, focusLine };
}

/**
 * Call Gemini API to generate intelligent dynamic storyboards
 */
async function callGeminiApi(
  prompt: string,
  apiKey: string,
  language: string,
  theme: EditorTheme,
  aspectRatio: AspectRatio
): Promise<Storyboard> {
  const systemPrompt = `Bạn là một đạo diễn video kỹ thuật và chuyên gia lập trình cấp cao.
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
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash'];
  let lastErrorMsg = '';

  for (const model of models) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
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
            responseMimeType: 'application/json'
          }
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error?.message || `HTTP ${response.status} lỗi kết nối`;

        // Direct authentication or quota errors -> throw immediately
        if (
          response.status === 400 ||
          response.status === 403 ||
          response.status === 429 ||
          message.includes('API key') ||
          message.includes('leaked') ||
          message.includes('Quota')
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
        lastErrorMsg = 'Yêu cầu tới Google AI Studio quá thời gian chờ (Timeout 15s). Vui lòng thử lại.';
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

  throw new Error(lastErrorMsg || 'Không thể tạo kịch bản từ Gemini AI. Vui lòng kiểm tra lại API Key');
}

/**
 * Generates continuous, comprehensive line-by-line pedagogical narrations dynamically tailored to actual code syntax
 */
function buildComprehensiveSpeakerNarrative(
  chunkLines: string[],
  startTypingFromLine: number,
  totalLines: number,
  language: string
): string {
  const sentences: string[] = [];
  const validLines = chunkLines.map((l) => l.trim()).filter((l) => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'));

  // 1. Detect Imports (Deduplicated)
  const importLines = validLines.filter((l) => l.startsWith('import ') || l.startsWith('from '));
  if (importLines.length > 0) {
    const rawModules = importLines.map((l) => l.replace(/^(import|from)\s+([a-zA-Z0-9_.]+).*/, '$2').split('.')[0]);
    const uniqueModules = Array.from(new Set(rawModules)).join(', ');
    sentences.push(`Đầu tiên, chúng ta nạp module ${uniqueModules} để phục vụ các xử lý cần thiết trong chương trình.`);
  }

  // 2. Detect Lifespan & Context Managers
  if (validLines.some((l) => l.includes('asynccontextmanager') || l.includes('lifespan'))) {
    sentences.push('Định nghĩa hàm lifespan bất đồng bộ để quản lý việc khởi tạo tài nguyên kết nối cơ sở dữ liệu khi khởi động và dọn dẹp an toàn khi tắt server.');
  }

  // 3. Detect Middleware configuration
  if (validLines.some((l) => l.includes('add_middleware') || l.includes('CORSMiddleware') || l.includes('GZipMiddleware'))) {
    sentences.push('Cấu hình middleware bảo mật CORS cho phép kết nối an toàn từ domain client và kích hoạt nén GZip để tối ưu tốc độ truyền tải.');
  } else if (validLines.some((l) => l.includes('@app.middleware(') || l.includes('process_time'))) {
    sentences.push('Tạo custom middleware đo thời gian xử lý và gắn header X-Process-Time vào mọi phản hồi của hệ thống.');
  }

  // 4. Detect FastAPI App & Server initialization
  if (validLines.some((l) => l.includes('FastAPI(') || l.includes('express()') || l.includes('docs_url'))) {
    sentences.push('Khởi tạo đối tượng ứng dụng với đầy đủ thông tin phiên bản và cấu hình tài liệu tự động Swagger UI.');
  }

  // 5. Detect Function / Class definitions
  const defLines = validLines.filter((l) => l.startsWith('def ') || l.startsWith('class ') || l.startsWith('function ') || l.startsWith('export const '));
  if (defLines.length > 0 && !validLines.some((l) => l.includes('lifespan') || l.includes('process_time'))) {
    const names = defLines.map((l) => l.replace(/^(def|class|function|export const)\s+([a-zA-Z0-9_]+).*/, '$2')).join(', ');
    sentences.push(`Tiếp theo, chúng ta định nghĩa cấu trúc chính với ${defLines[0].startsWith('class') ? 'lớp' : 'hàm'} ${names}.`);
  }

  // 6. Detect Variables & Random/Math operations
  const assignLines = validLines.filter((l) => /^[a-zA-Z0-9_]+\s*=/.test(l));
  if (assignLines.some((l) => l.includes('random.randint') || l.includes('Math.random'))) {
    sentences.push('Máy tính sử dụng hàm random để chọn ngẫu nhiên một số bí mật trong khoảng từ 1 đến 100 và khởi tạo bộ đếm số lần đoán.');
  } else if (assignLines.length > 0 && defLines.length === 0 && !validLines.some((l) => l.includes('FastAPI(') || l.includes('add_middleware'))) {
    const varNames = assignLines.slice(0, 2).map((l) => l.split('=')[0].trim()).join(', ');
    sentences.push(`Khởi tạo các biến lưu trữ dữ liệu gồm ${varNames} để quản lý trạng thái chương trình.`);
  }

  // 7. Detect Loops & User Inputs
  if (validLines.some((l) => l.startsWith('while ') || l.startsWith('for '))) {
    sentences.push('Sử dụng vòng lặp để duy trì tương tác liên tục với người dùng cho đến khi đạt điều kiện dừng.');
  }
  if (validLines.some((l) => l.includes('input(') || l.includes('prompt(') || l.includes('readline'))) {
    sentences.push('Tại mỗi lượt, chương trình nhận dữ liệu dự đoán từ bàn phím và ép kiểu sang số nguyên.');
  }

  // 8. Detect Try/Except error handling
  if (validLines.some((l) => l.startsWith('try:') || l.startsWith('except '))) {
    sentences.push('Bọc khối xử lý trong try/except để bắt lỗi ValueError, đảm bảo chương trình không bị dừng đột ngột khi người chơi nhập sai kiểu.');
  }

  // 9. Detect Conditional branching & Win condition
  if (validLines.some((l) => l.startsWith('if ') || l.startsWith('elif ') || l.startsWith('else:'))) {
    if (validLines.some((l) => l.includes('CHÚC MỪNG') || l.includes('break') || l.includes('thắng') || l.includes('success'))) {
      sentences.push('So sánh số người chơi đoán với số bí mật để đưa ra gợi ý lớn hơn hay nhỏ hơn, đồng thời in thông báo chúc mừng khi đoán trúng và kết thúc lượt chơi.');
    } else if (!validLines.some((l) => l.includes('lifespan') || l.includes('process_time'))) {
      sentences.push('Thực hiện kiểm tra các điều kiện rẽ nhánh để điều hướng luồng xử lý chính xác.');
    }
  }

  // 10. Detect Health Endpoints & Routing
  if (validLines.some((l) => l.includes('@app.get("/health') || l.includes('health_check'))) {
    sentences.push('Cài đặt endpoint kiểm tra sức khỏe /health để giám sát uptime của hệ thống trong môi trường Production.');
  }

  // 11. Detect Method invocations
  if (validLines.some((l) => l.includes('.append(') || l.includes('.push('))) {
    sentences.push('Gọi phương thức append để chèn phần tử mới vào cuối danh sách.');
  }
  if (validLines.some((l) => l.includes('.insert(') || l.includes('.splice('))) {
    sentences.push('Sử dụng hàm insert để chèn phần tử vào vị trí chỉ định.');
  }

  // Fallback if generic
  if (sentences.length === 0) {
    sentences.push(`Ở phân cảnh này, chúng ta tiếp tục triển khai các câu lệnh từ dòng ${startTypingFromLine} đến dòng ${startTypingFromLine + chunkLines.length - 1}.`);
    sentences.push('Mã nguồn được hoàn thiện tuần tự giúp liên kết toàn bộ logic ứng dụng.');
  }

  return sentences.join(' ');
}

/**
 * Intelligent Semantic Block Parser for Pasted Source Code:
 * Segments code along natural logical boundaries with a minimum chunk size (4-15 lines).
 * Ensures 100% of code lines from line 1 to N are preserved, progressively typed, and accurately highlighted.
 */
function convertUserCodeToStoryboard(
  rawCode: string,
  language: string,
  theme: EditorTheme,
  aspectRatio: AspectRatio
): Storyboard {
  const allLines = rawCode.split('\n');
  const lowerCode = rawCode.toLowerCase();

  // Dynamic Filename & Title detection
  let filename = language === 'python' ? 'main.py' : language === 'typescript' ? 'index.ts' : 'app.js';
  let title = `Demo: Triển khai mã nguồn ${language.toUpperCase()}`;
  let terminalOutput = `[SUCCESS] Thực thi thành công toàn bộ ${allLines.length} dòng code!`;
  let terminalScript = `Chạy thử nghiệm trên terminal, chương trình hoạt động chuẩn xác và hoàn thành toàn bộ tác vụ.`;

  if (lowerCode.includes('fastapi') && (lowerCode.includes('cors') || lowerCode.includes('middleware') || lowerCode.includes('lifespan'))) {
    filename = 'main.py';
    title = 'Cấu hình FastAPI Production & Middleware Bảo Mật';
    terminalOutput = `INFO:     Started server process [8524]
INFO:     Waiting for application startup.
[STARTUP] Kết nối Database Pool và nạp Redis Cache...
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)

>> GET /health -> 200 OK {"status": "healthy", "environment": "production"} (X-Process-Time: 0.0018s)
>> GET /api/docs -> 200 OK (Swagger UI sẵn sàng)
[SUCCESS] Khởi chạy FastAPI Production thành công!`;
    terminalScript = `Khởi chạy server với Uvicorn, ứng dụng nạp các sự kiện khởi động lifespan, cấu hình middleware CORS, đo thời gian xử lý và phục vụ tài liệu Swagger UI chuẩn xác!`;
  } else if (lowerCode.includes('game_doan_so') || lowerCode.includes('đoán số') || lowerCode.includes('randint')) {
    filename = 'game_doan_so.py';
    title = 'Trò chơi Đoán Số (1 - 100) bằng Python';
    terminalOutput = `=== GAME ĐOÁN SỐ (1 - 100) ===
Tôi đã nghĩ ra một số. Hãy đoán xem đó là số nào!

Nhập số bạn đoán: 50
-> Lớn hơn nữa!
Nhập số bạn đoán: 75
-> Nhỏ hơn nữa!
Nhập số bạn đoán: 68

🎉 CHÚC MỪNG! Bạn đã đoán đúng số 68 sau 3 lần thử!
[SUCCESS] Trò chơi kết thúc thành công!`;
    terminalScript = `Chạy trò chơi trên terminal, máy tính sinh số bí mật ngẫu nhiên, nhận các lần đoán từ người chơi và hiển thị thông báo chiến thắng sau 3 lượt thử!`;
  } else if (lowerCode.includes('so_list') || lowerCode.includes('demo: array')) {
    filename = 'demo_array.py';
    title = 'Demo: Mảng & Danh sách trong Python';
    terminalOutput = `============================================================
1. LIST — mảng động, linh hoạt
============================================================
Danh sách ban đầu : [10, 20, 30, 40, 50]
Sau append(60)    : [10, 20, 30, 40, 50, 60]
Sau insert(0, 5)  : [5, 10, 20, 30, 40, 50, 60]

[SUCCESS] Thực thi thành công toàn bộ ${allLines.length} dòng code!`;
    terminalScript = `Chạy file trên terminal, toàn bộ các hàm và lệnh in ấn hiển thị kết quả định dạng chuẩn xác, minh hoạ rõ ràng các phương thức của List.`;
  }

  const totalLines = allLines.length;
  const rawBreakPoints: number[] = [0];
  let inDocstring = false;

  for (let i = 0; i < totalLines; i++) {
    const line = allLines[i].trim();

    if (line.startsWith('"""') || line.startsWith("'''")) {
      inDocstring = !inDocstring;
      if (!inDocstring && i + 1 < totalLines) {
        let nextIdx = i + 1;
        while (
          nextIdx < totalLines &&
          (allLines[nextIdx].trim().startsWith('import ') ||
            allLines[nextIdx].trim().startsWith('from ') ||
            allLines[nextIdx].trim() === '')
        ) {
          nextIdx++;
        }
        if (nextIdx < totalLines && !rawBreakPoints.includes(nextIdx)) {
          rawBreakPoints.push(nextIdx);
        }
      }
      continue;
    }

    if (!inDocstring) {
      const prevLine = i > 0 ? allLines[i - 1].trim() : '';
      const isSectionComment =
        (line.startsWith('# ---') ||
          line.startsWith('// ---') ||
          line.startsWith('# ===') ||
          /^#\s*\d+\./.test(line)) &&
        !prevLine.startsWith('#');
      const isDefOrClass =
        line.startsWith('def ') ||
        line.startsWith('class ') ||
        line.startsWith('function ') ||
        line.startsWith('export const ');

      if ((isSectionComment || isDefOrClass) && i > 0 && !rawBreakPoints.includes(i)) {
        rawBreakPoints.push(i);
      }
    }
  }

  rawBreakPoints.sort((a, b) => a - b);
  if (rawBreakPoints[rawBreakPoints.length - 1] !== totalLines) {
    rawBreakPoints.push(totalLines);
  }

  // Merge any chunks that are too small (< 4 lines) with the next chunk
  const finalBreakPoints: number[] = [0];
  for (let k = 1; k < rawBreakPoints.length; k++) {
    const prev = finalBreakPoints[finalBreakPoints.length - 1];
    const curr = rawBreakPoints[k];
    if (curr - prev >= 4 || k === rawBreakPoints.length - 1) {
      finalBreakPoints.push(curr);
    }
  }

  if (finalBreakPoints[finalBreakPoints.length - 1] !== totalLines) {
    finalBreakPoints[finalBreakPoints.length - 1] = totalLines;
  }

  const scenes: Scene[] = [];

  for (let b = 0; b < finalBreakPoints.length - 1; b++) {
    const startLineIdx = finalBreakPoints[b];
    const endLineIdx = finalBreakPoints[b + 1];

    if (endLineIdx <= startLineIdx) continue;

    const chunkLines = allLines.slice(startLineIdx, endLineIdx);
    const progressiveCode = allLines.slice(0, endLineIdx).join('\n');
    const startTypingFromLine = startLineIdx + 1; // 1-indexed
    const newLinesCount = endLineIdx - startLineIdx;

    // Intelligent Core Highlighting: Picks only meaningful lines, ignoring comments & docstrings
    const { highlightLines, focusLine } = extractSmartHighlightLines(chunkLines, startTypingFromLine);

    // Continuous, Deep Dynamic Pedagogical Narration
    const speakerScript = buildComprehensiveSpeakerNarrative(chunkLines, startTypingFromLine, totalLines, language);

    const chunkFirstLine = chunkLines.find((l) => l.trim().length > 0)?.trim() || '';
    let sceneTitle = `Phần ${b + 1}: Triển khai mã nguồn`;

    if (chunkFirstLine.startsWith('import ') || chunkFirstLine.startsWith('from ')) {
      sceneTitle = `Phần ${b + 1}: Khai báo module & Khởi tạo`;
    } else if (chunkFirstLine.startsWith('def game_doan_so') || chunkFirstLine.includes('so_bi_mat')) {
      sceneTitle = `Phần ${b + 1}: Hàm game & Khởi tạo số bí mật`;
    } else if (chunkFirstLine.startsWith('while ') || chunkFirstLine.includes('du_doan')) {
      sceneTitle = `Phần ${b + 1}: Vòng lặp đoán số & Xử lý ngoại lệ`;
    } else if (chunkFirstLine.startsWith('if __name__')) {
      sceneTitle = `Phần ${b + 1}: Điểm khởi chạy chương trình`;
    } else if (b === finalBreakPoints.length - 2) {
      sceneTitle = `Phần ${b + 1}: Hoàn thiện logic chương trình`;
    }

    scenes.push({
      id: `user-sc-${b + 1}`,
      type: 'editor',
      title: sceneTitle,
      filename,
      language,
      code: progressiveCode,
      startTypingFromLine,
      highlightLines,
      zoomScale: 1.08,
      focusLine,
      speakerScript,
      durationInFrames: Math.max(270, newLinesCount * 40 + 135)
    });
  }

  // Final Terminal Scene
  scenes.push({
    id: `user-sc-term`,
    type: 'terminal',
    title: 'Chạy thử nghiệm trên Terminal',
    command: language === 'python' ? `python3 ${filename}` : `node ${filename}`,
    output: terminalOutput,
    speakerScript: terminalScript,
    durationInFrames: 240
  });

  return {
    title,
    description: `Video hướng dẫn từng bước viết và thực thi ${totalLines} dòng code ${language}`,
    aspectRatio,
    theme,
    fps: 30,
    scenes
  };
}

function generateCrudApiDemo(
  language: string,
  prompt: string,
  theme: EditorTheme,
  aspectRatio: AspectRatio
): Storyboard {
  const isPython = language === 'python' || prompt.toLowerCase().includes('python') || prompt.toLowerCase().includes('fastapi');

  if (isPython) {
    return {
      title: 'RESTful CRUD API với Python FastAPI',
      description: 'Xây dựng trọn bộ API quản lý sản phẩm: Thêm, Đọc, Sửa, Xóa với Pydantic & FastAPI',
      aspectRatio,
      theme,
      fps: 30,
      scenes: [
        {
          id: 'crud-py-1',
          type: 'editor',
          title: 'Khởi tạo FastAPI App & Pydantic Model',
          filename: 'main.py',
          language: 'python',
          code: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Product Management API")

class Product(BaseModel):
    id: int
    name: str
    price: float
    stock: int = 10

# Database bộ nhớ tạm (In-memory Storage)
products_db: List[Product] = [
    Product(id=1, name="Bàn phím cơ Mechanical", price=89.9, stock=15),
    Product(id=2, name="Chuột không dây Silent", price=35.0, stock=20)
]`,
          startTypingFromLine: 1,
          highlightLines: [5, 7, 8, 9, 10, 14],
          zoomScale: 1.08,
          focusLine: 7,
          speakerScript: "Chào mừng các bạn đến với bài xây dựng RESTful CRUD API với FastAPI. Đầu tiên, chúng ta import FastAPI, HTTPException và Pydantic BaseModel. Khởi tạo đối tượng app và định nghĩa schema Product gồm các trường id, name, price và stock. Sau đó, ta thiết lập danh sách products_db mẫu để lưu trữ dữ liệu trong bộ nhớ.",
          durationInFrames: 330
        },
        {
          id: 'crud-py-2',
          type: 'editor',
          title: 'Tạo Endpoint Đọc (GET) và Thêm Mới (POST)',
          filename: 'main.py',
          language: 'python',
          code: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Product Management API")

class Product(BaseModel):
    id: int
    name: str
    price: float
    stock: int = 10

products_db: List[Product] = [
    Product(id=1, name="Bàn phím cơ Mechanical", price=89.9, stock=15),
    Product(id=2, name="Chuột không dây Silent", price=35.0, stock=20)
]

@app.get("/api/products", response_model=List[Product])
def get_all_products():
    """Lấy danh sách tất cả sản phẩm"""
    return products_db

@app.post("/api/products", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(product: Product):
    """Thêm một sản phẩm mới vào hệ thống"""
    for p in products_db:
        if p.id == product.id:
            raise HTTPException(status_code=400, detail="Mã sản phẩm đã tồn tại!")
    products_db.append(product)
    return product`,
          startTypingFromLine: 19,
          highlightLines: [19, 21, 24, 28, 29],
          zoomScale: 1.08,
          focusLine: 24,
          speakerScript: "Tiếp theo, chúng ta định nghĩa 2 endpoint đầu tiên: GET /api/products để đọc toàn bộ danh sách sản phẩm, và POST /api/products với mã HTTP 201 Created để thêm sản phẩm mới. Trong hàm create_product, ta kiểm tra trùng lặp id trước khi append vào danh sách và trả về đối tượng vừa tạo.",
          durationInFrames: 360
        },
        {
          id: 'crud-py-3',
          type: 'editor',
          title: 'Tạo Endpoint Sửa (PUT) và Xóa (DELETE)',
          filename: 'main.py',
          language: 'python',
          code: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Product Management API")

class Product(BaseModel):
    id: int
    name: str
    price: float
    stock: int = 10

products_db: List[Product] = [
    Product(id=1, name="Bàn phím cơ Mechanical", price=89.9, stock=15),
    Product(id=2, name="Chuột không dây Silent", price=35.0, stock=20)
]

@app.get("/api/products", response_model=List[Product])
def get_all_products():
    return products_db

@app.post("/api/products", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(product: Product):
    for p in products_db:
        if p.id == product.id:
            raise HTTPException(status_code=400, detail="Mã sản phẩm đã tồn tại!")
    products_db.append(product)
    return product

@app.put("/api/products/{product_id}", response_model=Product)
def update_product(product_id: int, updated: Product):
    """Cập nhật thông tin sản phẩm theo ID"""
    for idx, p in enumerate(products_db):
        if p.id == product_id:
            products_db[idx] = updated
            return updated
    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm!")

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int):
    """Xóa sản phẩm khỏi hệ thống theo ID"""
    for idx, p in enumerate(products_db):
        if p.id == product_id:
            deleted = products_db.pop(idx)
            return {"message": f"Đã xóa thành công sản phẩm: {deleted.name}"}
    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm!")`,
          startTypingFromLine: 31,
          highlightLines: [31, 35, 37, 39, 43, 44],
          zoomScale: 1.08,
          focusLine: 35,
          speakerScript: "Để hoàn thiện tính năng CRUD, chúng ta viết endpoint PUT /api/products/{product_id} cập nhật thông tin sản phẩm và endpoint DELETE để xóa phần tử bằng phương thức pop(). Cả hai đều có cơ chế bắt lỗi 404 Not Found nếu không tìm thấy ID yêu cầu.",
          durationInFrames: 380
        },
        {
          id: 'crud-py-term',
          type: 'terminal',
          title: 'Kiểm thử toàn diện CRUD trên Terminal',
          command: 'pytest test_api.py -v',
          output: `test_api.py::test_get_all_products PASSED             [ 25%] -> 200 OK (2 items)
test_api.py::test_create_product PASSED               [ 50%] -> 201 Created (id: 3)
test_api.py::test_update_product_price PASSED         [ 75%] -> 200 OK (price: 99.9)
test_api.py::test_delete_product PASSED               [100%] -> 200 OK (Deleted)

======================== 4 passed in 0.42s ========================
[SUCCESS] Toàn bộ 4 chức năng CRUD (GET, POST, PUT, DELETE) hoạt động hoàn hảo!`,
          speakerScript: "Chạy bộ kiểm thử tự động với PyTest. Toàn bộ 4 chức năng CRUD gồm lấy danh sách, thêm sản phẩm mới, cập nhật giá và xóa sản phẩm đều phản hồi mã HTTP chuẩn xác 100%!",
          durationInFrames: 240
        }
      ]
    };
  } else {
    // Node.js Express Implementation
    return {
      title: 'RESTful CRUD API với Node.js & Express',
      description: 'Xây dựng trọn bộ REST API quản lý sản phẩm: Thêm, Đọc, Sửa, Xóa',
      aspectRatio,
      theme,
      fps: 30,
      scenes: [
        {
          id: 'crud-node-1',
          type: 'editor',
          title: 'Khởi tạo Express Server & Mock Database',
          filename: 'server.js',
          language: 'javascript',
          code: `const express = require('express');
const app = express();
app.use(express.json());

// In-memory Database sản phẩm
let products = [
  { id: 1, name: 'Bàn phím cơ RGB', price: 120, inStock: true },
  { id: 2, name: 'Màn hình 4K IPS', price: 450, inStock: true }
];`,
          startTypingFromLine: 1,
          highlightLines: [1, 2, 3, 6, 7, 8],
          zoomScale: 1.08,
          focusLine: 6,
          speakerScript: "Chào các bạn, hôm nay chúng ta sẽ cùng xây dựng trọn bộ RESTful API CRUD với Node.js và Express. Đầu tiên, chúng ta nạp thư viện express, bật middleware express.json để phân tích body dạng JSON, và khởi tạo mảng products lưu trữ dữ liệu sản phẩm trong bộ nhớ.",
          durationInFrames: 300
        },
        {
          id: 'crud-node-2',
          type: 'editor',
          title: 'Viết Route Đọc (GET) và Thêm Mới (POST)',
          filename: 'server.js',
          language: 'javascript',
          code: `const express = require('express');
const app = express();
app.use(express.json());

let products = [
  { id: 1, name: 'Bàn phím cơ RGB', price: 120, inStock: true },
  { id: 2, name: 'Màn hình 4K IPS', price: 450, inStock: true }
];

// 1. GET - Đọc danh sách sản phẩm
app.get('/api/products', (req, res) => {
  res.status(200).json({ success: true, data: products });
});

// 2. POST - Thêm mới sản phẩm
app.post('/api/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: 'Tên và giá sản phẩm là bắt buộc!' });
  }
  const newProduct = { id: Date.now(), name, price: Number(price), inStock: true };
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});`,
          startTypingFromLine: 11,
          highlightLines: [12, 13, 17, 22, 23, 24],
          zoomScale: 1.08,
          focusLine: 17,
          speakerScript: "Tiếp theo, ta viết 2 route chính: GET /api/products trả về toàn bộ danh sách với mã 200, và POST /api/products để tạo sản phẩm mới. Trong route POST, ta kiểm tra tính hợp lệ của dữ liệu đầu vào, gán id duy nhất bằng Date.now(), push vào mảng và phản hồi mã 201 Created.",
          durationInFrames: 360
        },
        {
          id: 'crud-node-3',
          type: 'editor',
          title: 'Viết Route Cập Nhật (PUT) và Xóa (DELETE)',
          filename: 'server.js',
          language: 'javascript',
          code: `const express = require('express');
const app = express();
app.use(express.json());

let products = [
  { id: 1, name: 'Bàn phím cơ RGB', price: 120, inStock: true },
  { id: 2, name: 'Màn hình 4K IPS', price: 450, inStock: true }
];

app.get('/api/products', (req, res) => {
  res.status(200).json({ success: true, data: products });
});

app.post('/api/products', (req, res) => {
  const { name, price } = req.body;
  const newProduct = { id: Date.now(), name, price: Number(price), inStock: true };
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// 3. PUT - Cập nhật thông tin theo ID
app.put('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Không tìm thấy sản phẩm!' });
  products[index] = { ...products[index], ...req.body };
  res.status(200).json({ success: true, data: products[index] });
});

// 4. DELETE - Xóa sản phẩm theo ID
app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  if (products.length === initialLength) return res.status(404).json({ error: 'Không tìm thấy sản phẩm!' });
  res.status(200).json({ success: true, message: 'Đã xóa sản phẩm thành công!' });
});

app.listen(5000, () => console.log('Server chạy tại port 5000'));`,
          startTypingFromLine: 24,
          highlightLines: [25, 27, 29, 34, 36, 39],
          zoomScale: 1.08,
          focusLine: 25,
          speakerScript: "Để hoàn thiện hệ thống, ta cài đặt route PUT cập nhật thuộc tính sản phẩm dựa trên ID bằng toán tử spread, và route DELETE lọc bỏ phần tử khỏi mảng với filter(). Cuối cùng, hàm app.listen khởi động máy chủ tại cổng 5000 sẵn sàng nhận request.",
          durationInFrames: 380
        },
        {
          id: 'crud-node-term',
          type: 'terminal',
          title: 'Thử nghiệm gọi CRUD API qua cURL',
          command: 'curl -X POST http://localhost:5000/api/products -d \'{"name":"Tai nghe Sony","price":299}\' -H "Content-Type: application/json"',
          output: `HTTP/1.1 201 Created
{ "success": true, "data": { "id": 1724589201, "name": "Tai nghe Sony", "price": 299, "inStock": true } }

>> curl -X GET http://localhost:5000/api/products
HTTP/1.1 200 OK -> Đã lấy 3 sản phẩm thành công!

>> curl -X DELETE http://localhost:5000/api/products/1
HTTP/1.1 200 OK -> "Đã xóa sản phẩm thành công!"
[SUCCESS] Hệ thống RESTful API CRUD hoàn thành 100%!`,
          speakerScript: "Thử nghiệm gửi các request POST, GET và DELETE tới server. Toàn bộ các phản hồi JSON đều trả về mã trạng thái HTTP chuẩn xác 201 Created và 200 OK!",
          durationInFrames: 240
        }
      ]
    };
  }
}

function generateFastApiConfigDemo(theme: EditorTheme, aspectRatio: AspectRatio): Storyboard {
  return {
    title: 'Cấu hình FastAPI Production & Middleware Bảo Mật',
    description: 'Thiết lập trọn bộ FastAPI Production: Lifespan Events, CORS, GZip, Custom Middleware & Health Check',
    aspectRatio,
    theme,
    fps: 30,
    scenes: [
      {
        id: 'fastapi-cfg-1',
        type: 'editor',
        title: 'Khai báo Module & Lifespan Context Manager',
        filename: 'main.py',
        language: 'python',
        code: `from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import time

# 1. Lifespan Event Handler (Startup & Shutdown)
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] Kết nối Database Pool và nạp Redis Cache...")
    yield
    print("[SHUTDOWN] Đóng kết nối Database an toàn!")`,
        startTypingFromLine: 1,
        highlightLines: [1, 2, 3, 4, 8, 9, 10, 12],
        zoomScale: 1.08,
        focusLine: 9,
        speakerScript: "Chào mừng các bạn đến với bài cấu hình FastAPI Production chuyên nghiệp. Đầu tiên, chúng ta nạp các module cần thiết gồm FastAPI, Request, CORSMiddleware, GZipMiddleware và asynccontextmanager. Tiếp theo, ta định nghĩa hàm lifespan bất đồng bộ để quản lý việc kết nối Database khi khởi động và giải phóng tài nguyên an toàn khi dừng server.",
        durationInFrames: 330
      },
      {
        id: 'fastapi-cfg-2',
        type: 'editor',
        title: 'Khởi tạo FastAPI App & Middleware Bảo Mật CORS',
        filename: 'main.py',
        language: 'python',
        code: `from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import time

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] Kết nối Database Pool và nạp Redis Cache...")
    yield
    print("[SHUTDOWN] Đóng kết nối Database an toàn!")

# 2. Khởi tạo FastAPI App với Metadata & Docs URL
app = FastAPI(
    title="Production Enterprise API",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# 3. Cấu hình Middleware Bảo mật & Nén GZip
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://myapp.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)`,
        startTypingFromLine: 14,
        highlightLines: [15, 16, 17, 18, 19, 23, 24, 25, 29],
        zoomScale: 1.08,
        focusLine: 23,
        speakerScript: "Tiếp theo, chúng ta khởi tạo đối tượng FastAPI với các tham số metadata, chỉ định đường dẫn tài liệu Swagger UI tại /api/docs và gắn trình quản lý lifespan. Sau đó, ta thiết lập middleware CORS cho phép truy cập từ các domain chỉ định và kích hoạt GZipMiddleware nén các gói tin lớn hơn 1KB.",
        durationInFrames: 360
      },
      {
        id: 'fastapi-cfg-3',
        type: 'editor',
        title: 'Custom Middleware Đo Thời Gian & Health Check Endpoint',
        filename: 'main.py',
        language: 'python',
        code: `from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import time

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] Kết nối Database Pool và nạp Redis Cache...")
    yield
    print("[SHUTDOWN] Đóng kết nối Database an toàn!")

app = FastAPI(
    title="Production Enterprise API",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://myapp.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 4. Custom Middleware đo thời gian xử lý Request
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response

# 5. Endpoint kiểm tra trạng thái Hệ thống
@app.get("/health", tags=["Monitoring"])
async def health_check():
    return {
        "status": "healthy",
        "environment": "production",
        "timestamp": int(time.time())
    }`,
        startTypingFromLine: 31,
        highlightLines: [32, 33, 34, 35, 36, 37, 40, 41, 42],
        zoomScale: 1.08,
        focusLine: 35,
        speakerScript: "Để hoàn thiện cấu hình, ta viết custom middleware đo thời gian xử lý request và tự động đính kèm header X-Process-Time vào phản hồi. Cuối cùng, cài đặt endpoint /health để phục vụ việc kiểm tra và giám sát trạng thái uptime của hệ thống trong môi trường Production.",
        durationInFrames: 380
      },
      {
        id: 'fastapi-cfg-term',
        type: 'terminal',
        title: 'Khởi chạy FastAPI Production Server',
        command: 'uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4',
        output: `INFO:     Started server process [8524] (Worker PID: 8524)
INFO:     Waiting for application startup.
[STARTUP] Kết nối Database Pool và nạp Redis Cache...
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)

>> curl -I http://localhost:8000/health
HTTP/1.1 200 OK
content-type: application/json
X-Process-Time: 0.0014s
{"status": "healthy", "environment": "production", "timestamp": 1724589300}

>> curl -I http://localhost:8000/api/docs
HTTP/1.1 200 OK -> Swagger UI sẵn sàng!
[SUCCESS] Khởi chạy FastAPI Production thành công!`,
        speakerScript: "Khởi chạy server với Uvicorn đa luồng workers. Ứng dụng nạp sự kiện lifespan, áp dụng toàn bộ middleware bảo mật và phản hồi endpoint /health kèm header X-Process-Time chuẩn xác 100%!",
        durationInFrames: 240
      }
    ]
  };
}

function generateSmartOfflineDemo(
  prompt: string,
  language: string,
  theme: EditorTheme,
  aspectRatio: AspectRatio
): Storyboard {
  const lower = prompt.toLowerCase();

  // 1. Advanced FastAPI Configuration / Middleware / Production
  if (
    (lower.includes('fastapi') || lower.includes('python')) &&
    (lower.includes('cấu hình') || lower.includes('middleware') || lower.includes('cors') || lower.includes('lifespan') || lower.includes('production') || lower.includes('config'))
  ) {
    return generateFastApiConfigDemo(theme, aspectRatio);
  }

  // 2. CRUD API / RESTful API (Express or FastAPI)
  if (
    lower.includes('crud') ||
    lower.includes('restful') ||
    lower.includes('thêm, đọc, sửa, xóa') ||
    lower.includes('thêm sửa xóa') ||
    lower.includes('quản lý sản phẩm') ||
    lower.includes('quản lý người dùng') ||
    lower.includes('fastapi')
  ) {
    return generateCrudApiDemo(language, prompt, theme, aspectRatio);
  }

  // 2. Binary Search
  if (lower.includes('binary') || lower.includes('nhị phân')) {
    return { ...PRESET_TEMPLATES['binary-search'], theme, aspectRatio };
  }

  // 3. Fibonacci
  if (lower.includes('fibo')) {
    const ext = language === 'python' ? 'py' : 'js';
    return {
      title: 'Thuật toán Dãy số Fibonacci tối ưu',
      description: 'Tính số Fibonacci thứ n với quy hoạch động O(n)',
      aspectRatio,
      theme,
      fps: 30,
      scenes: [
        {
          id: 'fib-1',
          type: 'editor',
          title: 'Khởi tạo hàm tính Fibonacci',
          filename: `fibonacci.${ext}`,
          language: language === 'python' ? 'python' : 'javascript',
          code: language === 'python'
            ? `def fibonacci(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n`
            : `function fibonacci(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;`,
          startTypingFromLine: 1,
          highlightLines: [4],
          zoomScale: 1.1,
          focusLine: 4,
          speakerScript: "Để tính số Fibonacci nhanh nhất, chúng ta sử dụng kỹ thuật Memoization với bảng nhớ memo. Nếu giá trị n đã được tính trước đó thì trả về ngay từ memo, còn nếu n <= 1 thì trả về chính n.",
          durationInFrames: 300
        },
        {
          id: 'fib-2',
          type: 'editor',
          title: 'Lưu kết quả vào Memo và đệ quy',
          filename: `fibonacci.${ext}`,
          language: language === 'python' ? 'python' : 'javascript',
          code: language === 'python'
            ? `def fibonacci(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)\n    return memo[n]`
            : `function fibonacci(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);\n  return memo[n];\n}`,
          startTypingFromLine: 5,
          highlightLines: [6, 7],
          zoomScale: 1.15,
          focusLine: 6,
          speakerScript: "Tiếp tục đệ quy tính tổng của hai số liền trước fibonacci(n-1) cộng fibonacci(n-2), sau đó lưu kết quả vào bảng nhớ memo[n] rồi mới trả về. Điều này giúp giảm độ phức tạp từ O(2^n) xuống O(n).",
          durationInFrames: 330
        },
        {
          id: 'fib-3',
          type: 'terminal',
          title: 'Chạy thử nghiệm',
          command: language === 'python' ? 'python fibonacci.py' : 'node fibonacci.js',
          output: `>> print("Fibonacci(10):", fibonacci(10))\nFibonacci(10): 55\n>> print("Fibonacci(50):", fibonacci(50))\nFibonacci(50): 12586269025\n[SUCCESS] Đã tính xong trong 0.001s!`,
          speakerScript: "Chạy thử với số n = 50, thuật toán tính ra kết quả chính xác hàng chục tỷ chỉ trong chưa đầy 1 mili-giây trên terminal.",
          durationInFrames: 210
        }
      ]
    };
  }

  // 4. QuickSort
  if (lower.includes('quick') || lower.includes('sort') || lower.includes('sắp xếp')) {
    return { ...PRESET_TEMPLATES['quicksort-python'], theme, aspectRatio };
  }

  // 5. React
  if (lower.includes('react') || lower.includes('hook') || lower.includes('state')) {
    return { ...PRESET_TEMPLATES['react-counter'], theme, aspectRatio };
  }

  // 6. JWT Authentication
  if (lower.includes('jwt') || lower.includes('token') || lower.includes('authentication') || lower.includes('xác thực')) {
    return { ...PRESET_TEMPLATES['express-jwt-api'], theme, aspectRatio };
  }

  // 6. Generic Fallback
  const cleanTitle = prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt;
  const ext = language === 'python' ? 'py' : language === 'typescript' ? 'ts' : 'js';

  return {
    title: `Demo: ${cleanTitle}`,
    description: `Video hướng dẫn giải thuật & triển khai mã nguồn cho: ${cleanTitle}`,
    aspectRatio,
    theme,
    fps: 30,
    scenes: [
      {
        id: 'gen-sc-1',
        type: 'editor',
        title: 'Khởi tạo cấu trúc hàm xử lý',
        filename: `solution.${ext}`,
        language,
        code: language === 'python'
          ? `# Yêu cầu: ${prompt}\n\ndef process_data(items):\n    # Khởi tạo mảng kết quả\n    result = []\n    print(f"Bắt đầu xử lý {len(items)} phần tử...")`
          : `// Yêu cầu: ${prompt}\n\nfunction processData(items) {\n  const result = [];\n  console.log(\`Bắt đầu xử lý \${items.length} phần tử...\`);`,
        startTypingFromLine: 1,
        highlightLines: [3, 5],
        zoomScale: 1.1,
        focusLine: 3,
        speakerScript: `Chào các bạn, hôm nay chúng ta sẽ cùng giải quyết bài toán: ${cleanTitle}. Đầu tiên, chúng ta khai báo cấu trúc hàm và thiết lập các biến danh sách lưu trữ dữ liệu ban đầu.`,
        durationInFrames: 300
      },
      {
        id: 'gen-sc-2',
        type: 'editor',
        title: 'Cài đặt thuật toán & lọc dữ liệu',
        filename: `solution.${ext}`,
        language,
        code: language === 'python'
          ? `def process_data(items):\n    result = []\n    for x in items:\n        if x > 0:\n            result.append(x * 2)\n    return sorted(result)`
          : `function processData(items) {\n  return items\n    .filter(x => x > 0)\n    .map(x => x * 2)\n    .sort((a, b) => a - b);\n}`,
        startTypingFromLine: 3,
        highlightLines: [4, 5, 6],
        zoomScale: 1.15,
        focusLine: 5,
        speakerScript: `Tiếp theo, chúng ta duyệt qua từng phần tử, lọc các giá trị dương hợp lệ, nhân đôi từng phần tử và sắp xếp mảng tăng dần trước khi trả về kết quả.`,
        durationInFrames: 330
      },
      {
        id: 'gen-sc-3',
        type: 'terminal',
        title: 'Kiểm tra kết quả trên Terminal',
        command: language === 'python' ? `python solution.${ext}` : `node solution.${ext}`,
        output: `>> Input: [10, -5, 3, 8, -2, 1]\n>> Output: [2, 6, 16, 20]\n[SUCCESS] Thuật toán hoàn thành xuất sắc!`,
        speakerScript: `Chạy thử nghiệm trên terminal, chương trình xử lý chính xác và in ra kết quả như mong đợi!`,
        durationInFrames: 210
      }
    ]
  };
}

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

  // 1. STRICT MODE: If API Key is present -> ONLY Call Google Gemini Live AI (NO Offline Fallback)
  if (apiKey && apiKey.trim()) {
    try {
      const sb = await callGeminiApi(prompt, apiKey.trim(), language, theme, aspectRatio);
      return { storyboard: sb, source: 'gemini-ai' };
    } catch (err: any) {
      // Strictly throw the error so user is notified immediately of the API issue
      throw new Error(`[Gemini AI Error] ${err.message || 'Không thể kết nối đến Gemini API. Vui lòng kiểm tra lại API Key'}`);
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
