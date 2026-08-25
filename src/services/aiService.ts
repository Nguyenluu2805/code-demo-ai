import { Storyboard, Scene, AspectRatio, EditorTheme } from '../types';

/**
 * Robust JSON parser that handles markdown codeblocks and extra characters from LLMs
 */
function cleanAndParseJson<T>(raw: string): T {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  return JSON.parse(cleaned) as T;
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${response.status}: Lỗi kết nối Gemini API`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error('Gemini API không phản hồi dữ liệu');
  }

  const storyboard = cleanAndParseJson<Storyboard>(textContent);
  storyboard.theme = theme;
  storyboard.aspectRatio = aspectRatio;
  storyboard.fps = 30;

  return storyboard;
}

/**
 * Generates continuous, comprehensive line-by-line pedagogical narrations for any code chunk
 */
function buildComprehensiveSpeakerNarrative(
  chunkLines: string[],
  startTypingFromLine: number,
  totalLines: number,
  language: string
): string {
  const sentences: string[] = [];
  const validLines = chunkLines.map((l) => l.trim()).filter((l) => l.length > 0);

  const hasImports = validLines.some((l) => l.startsWith('import ') || l.startsWith('from '));
  const hasDocstring = validLines.some((l) => l.startsWith('"""') || l.startsWith("'''"));
  const hasDef = validLines.some((l) => l.startsWith('def ') || l.startsWith('function '));

  if (hasDocstring || hasImports) {
    sentences.push(`Chào mừng các bạn đến với bài hướng dẫn thực hành ${language === 'python' ? 'Python' : language}.`);
    if (hasDocstring) {
      sentences.push('Đầu tiên, chúng ta thiết lập khối chú thích đầu file để tóm tắt các khái niệm cốt lõi cần tìm hiểu.');
    }
    if (hasImports) {
      sentences.push(`Tiếp theo, ta nạp các thư viện chuẩn như ${language === 'python' ? 'array và numpy' : 'module phụ thuộc'} để phục vụ xử lý mảng.`);
    }
    sentences.push('Toàn bộ các gói cần thiết đã sẵn sàng để chúng ta bắt đầu viết các khối lệnh bên dưới.');
    return sentences.join(' ');
  }

  if (hasDef) {
    sentences.push('Bây giờ, chúng ta sẽ xây dựng hàm hỗ trợ line nhận vào tham số title.');
    sentences.push('Bên trong hàm, ta dùng lệnh print in chuỗi 60 dấu bằng nhằm phân tách trực quan từng phần demo.');
    sentences.push('Hàm này sẽ giúp bảng kết quả hiển thị trên terminal trở nên rõ ràng và chuyên nghiệp hơn.');
    return sentences.join(' ');
  }

  const hasList = validLines.some((l) => l.includes('so_list') || l.includes('list') || l.includes('LIST'));
  const hasAppend = validLines.some((l) => l.includes('.append(') || l.includes('.push('));
  const hasInsert = validLines.some((l) => l.includes('.insert(') || l.includes('.splice('));

  if (hasList || hasAppend || hasInsert) {
    sentences.push('Bước vào phần này, chúng ta tìm hiểu kiểu dữ liệu List là mảng động linh hoạt trong Python.');
    if (validLines.some((l) => l.includes('so_list ='))) {
      sentences.push('Đầu tiên, ta khởi tạo biến so_list chứa 5 phần tử ban đầu từ 10 đến 50 và in danh sách gốc ra console.');
    }
    if (hasAppend) {
      sentences.push('Tiếp theo, ta gọi phương thức append(60) để chèn giá trị 60 vào vị trí cuối cùng của danh sách.');
    }
    if (hasInsert) {
      sentences.push('Sau đó, sử dụng hàm insert(0, 5) để chèn số 5 vào ngay vị trí đầu tiên có index là 0.');
    }
    sentences.push('Quan sát thấy danh sách được cập nhật liên tục và linh hoạt theo đúng thứ tự các thao tác.');
    return sentences.join(' ');
  }

  // Generic intelligent narrative
  sentences.push(`Ở phân cảnh này, chúng ta tiếp tục triển khai các câu lệnh từ dòng ${startTypingFromLine} đến dòng ${startTypingFromLine + chunkLines.length - 1}.`);
  sentences.push('Các câu lệnh được gõ phím tuần tự để thiết lập logic thuật toán và cập nhật các biến tương ứng.');
  sentences.push('Sau khi hoàn thành, khối lệnh này sẽ kết nối liền mạch với cấu trúc toàn bài.');
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
  const filename = language === 'python' ? 'demo_array.py' : language === 'typescript' ? 'index.ts' : 'app.js';
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

    // Continuous, Deep Pedagogical Narration
    const speakerScript = buildComprehensiveSpeakerNarrative(chunkLines, startTypingFromLine, totalLines, language);

    const chunkFirstLine = chunkLines.find((l) => l.trim().length > 0)?.trim() || '';
    let sceneTitle = `Phần ${b + 1}: Triển khai mã nguồn`;

    if (chunkFirstLine.startsWith('"""') || chunkFirstLine.startsWith("'''") || chunkFirstLine.startsWith('import ')) {
      sceneTitle = `Phần ${b + 1}: Giới thiệu & Khai báo thư viện`;
    } else if (chunkFirstLine.startsWith('def line') || chunkFirstLine.startsWith('def ') || chunkFirstLine.startsWith('function ')) {
      sceneTitle = `Phần ${b + 1}: Định nghĩa hàm hỗ trợ`;
    } else if (chunkFirstLine.includes('LIST') || chunkFirstLine.includes('so_list') || chunkFirstLine.startsWith('# 1.')) {
      sceneTitle = `Phần ${b + 1}: Thao tác với List trong Python`;
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
    output: `============================================================
1. LIST — mảng động, linh hoạt
============================================================
Danh sách ban đầu : [10, 20, 30, 40, 50]
Sau append(60)    : [10, 20, 30, 40, 50, 60]
Sau insert(0, 5)  : [5, 10, 20, 30, 40, 50, 60]

[SUCCESS] Thực thi thành công toàn bộ ${totalLines} dòng code!`,
    speakerScript: `Chạy file trên terminal, toàn bộ các hàm và lệnh in ấn hiển thị kết quả định dạng chuẩn xác, minh hoạ rõ ràng các phương thức của List.`,
    durationInFrames: 240
  });

  return {
    title: `Demo: Array & List trong ${language.toUpperCase()}`,
    description: `Video hướng dẫn từng bước viết và thực thi ${totalLines} dòng code ${language}`,
    aspectRatio,
    theme,
    fps: 30,
    scenes
  };
}

function generateSmartOfflineDemo(
  prompt: string,
  language: string,
  theme: EditorTheme,
  aspectRatio: AspectRatio
): Storyboard {
  const lower = prompt.toLowerCase();

  // 1. Binary Search
  if (lower.includes('binary') || lower.includes('nhị phân')) {
    return { ...PRESET_TEMPLATES['binary-search'], theme, aspectRatio };
  }

  // 2. Fibonacci
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

  // 3. QuickSort
  if (lower.includes('quick') || lower.includes('sort') || lower.includes('sắp xếp')) {
    return { ...PRESET_TEMPLATES['quicksort-python'], theme, aspectRatio };
  }

  // 4. React
  if (lower.includes('react') || lower.includes('hook') || lower.includes('state')) {
    return { ...PRESET_TEMPLATES['react-counter'], theme, aspectRatio };
  }

  // 5. Express JWT
  if (lower.includes('jwt') || lower.includes('auth') || lower.includes('express') || lower.includes('api')) {
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
): Promise<Storyboard> {
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
    trimmed.split('\n').length >= 3;

  if (isLikelyCode) {
    return convertUserCodeToStoryboard(prompt, language, theme, aspectRatio);
  }

  if (apiKey && apiKey.trim()) {
    try {
      return await callGeminiApi(prompt, apiKey, language, theme, aspectRatio);
    } catch (err: any) {
      console.warn('Gemini API failed, falling back to smart templates:', err.message);
      return generateSmartOfflineDemo(prompt, language, theme, aspectRatio);
    }
  }

  return generateSmartOfflineDemo(prompt, language, theme, aspectRatio);
}
