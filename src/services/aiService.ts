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
        highlightLines: [3, 4],
        zoomScale: 1.1,
        focusLine: 3,
        speakerScript: "Đầu tiên, chúng ta khai báo hàm quicksort nhận vào danh sách arr. Ở dòng 3 và 4, ta xử lý trường hợp cơ sở: nếu mảng có từ 1 phần tử trở xuống thì trả về ngay chính nó vì mảng đã được sắp xếp sẵn.",
        durationInFrames: 270 // 9.0s
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
        highlightLines: [5, 6, 7, 8, 10],
        zoomScale: 1.15,
        focusLine: 6,
        speakerScript: "Tiếp theo, ta chọn phần tử Pivot ở giữa mảng. Dùng list comprehension để chia mảng thành 3 nhóm: các số nhỏ hơn Pivot đưa vào mảng left, bằng Pivot đưa vào middle, và lớn hơn Pivot đưa vào right. Sau đó gọi đệ quy sắp xếp và gộp lại.",
        durationInFrames: 330 // 11.0s
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
        durationInFrames: 210 // 7.0s
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
        highlightLines: [2, 4, 5],
        zoomScale: 1.1,
        focusLine: 2,
        speakerScript: "Thuật toán tìm kiếm nhị phân yêu cầu mảng đã sắp xếp. Đầu tiên, chúng ta thiết lập 2 con trỏ left tại vị trí 0 và right ở cuối mảng. Vòng lặp while sẽ chạy liên tục chừng nào left chưa vượt quá right, và tính toán vị trí chỉ số ở giữa mid.",
        durationInFrames: 270 // 9.0s
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
        highlightLines: [6, 7, 8, 9, 10, 11],
        zoomScale: 1.15,
        focusLine: 6,
        speakerScript: "Tại mỗi bước, ta so sánh phần tử ở giữa arr[mid] với target. Nếu bằng target thì tìm thấy và trả về vị trí mid ngay. Nếu nhỏ hơn target thì dịch left = mid + 1, ngược lại nếu lớn hơn thì thu hẹp right = mid - 1. Nếu hết vòng lặp không thấy thì trả về -1.",
        durationInFrames: 330 // 11.0s
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
        durationInFrames: 210 // 7.0s
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
  const [count, setCount] = useState(initialValue);`,
        highlightLines: [3, 4],
        zoomScale: 1.1,
        focusLine: 3,
        speakerScript: "Chúng ta bắt đầu xây dựng custom hook useCounter nhận vào tham số initialValue mặc định là 0. Khởi tạo state count để lưu trữ giá trị đếm hiện tại bằng useState.",
        durationInFrames: 270
      },
      {
        id: 'sc-2',
        type: 'editor',
        title: 'Định nghĩa các hàm thao tác',
        filename: 'useCounter.ts',
        language: 'typescript',
        code: `import { useState, useCallback } from 'react';

export const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
};`,
        highlightLines: [6, 7, 8, 10],
        zoomScale: 1.15,
        focusLine: 6,
        speakerScript: "Tiếp theo, định nghĩa 3 hàm thao tác: increment tăng 1 đơn vị, decrement giảm 1 đơn vị, và reset đưa về giá trị ban đầu. Cả 3 hàm đều được bọc trong useCallback để tối ưu re-render. Cuối cùng trả về object chứa count và các hàm điều khiển.",
        durationInFrames: 360
      },
      {
        id: 'sc-3',
        type: 'terminal',
        title: 'Chạy thử nghiệm Jest Test',
        command: 'npm test useCounter.test.ts',
        output: `PASS  src/hooks/useCounter.test.ts
  ✓ should initialize with default value (4 ms)
  ✓ should increment and decrement correctly (6 ms)
  ✓ should reset to initial value (2 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total`,
        speakerScript: "Chạy bộ kiểm thử tự động với Jest, tất cả 3 trường hợp tăng, giảm và reset đều vượt qua hoàn hảo!",
        durationInFrames: 210
      }
    ]
  },
  'express-jwt-api': {
    title: 'Xác thực JWT Middleware trong Node.js',
    description: 'Demo Middleware kiểm tra Access Token trong Express REST API',
    aspectRatio: '16:9',
    theme: 'github-dark',
    fps: 30,
    scenes: [
      {
        id: 'exp-1',
        type: 'editor',
        title: 'Viết Auth Middleware',
        filename: 'auth.middleware.js',
        language: 'javascript',
        code: `const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Truy cập bị từ chối!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token không hợp lệ' });
    req.user = user;
    next();
  });
};`,
        highlightLines: [4, 5, 7, 8, 11, 13, 14],
        zoomScale: 1.1,
        focusLine: 7,
        speakerScript: "Chúng ta xây dựng hàm verifyToken làm middleware trung gian. Đầu tiên trích xuất Bearer Token từ header Authorization. Nếu không có token, trả về mã lỗi 401 Unauthorized. Ngược lại, dùng jwt.verify kiểm tra token với khóa bí mật trước khi chuyển tiếp cho controller.",
        durationInFrames: 360 // 12.0s
      },
      {
        id: 'exp-2',
        type: 'terminal',
        title: 'Kiểm tra với cURL',
        command: 'curl -H "Authorization: Bearer valid_token_here" http://localhost:5000/api/profile',
        output: `{
  "status": 200,
  "message": "Xác thực thành công",
  "data": {
    "userId": "usr_9981",
    "name": "Alex Nguyen",
    "role": "admin"
  }
}`,
        speakerScript: "Gửi request test bằng lệnh cURL kèm access token hợp lệ trong header Authorization. Server giải mã thành công thông tin người dùng và phản hồi dữ liệu JSON với mã HTTP 200.",
        durationInFrames: 210 // 7.0s
      }
    ]
  }
};

export async function generateStoryboardWithAI(
  prompt: string,
  apiKey?: string,
  language: string = 'python',
  theme: EditorTheme = 'one-dark',
  aspectRatio: AspectRatio = '16:9'
): Promise<Storyboard> {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return { ...PRESET_TEMPLATES['quicksort-python'], theme, aspectRatio };
  }

  // 1. Check if user pasted direct raw code
  const isDirectCode = trimmed.includes('\n') && (
    trimmed.includes('def ') || trimmed.includes('function ') ||
    trimmed.includes('const ') || trimmed.includes('class ') ||
    trimmed.includes('import ') || trimmed.includes('return ') ||
    trimmed.includes(';') || trimmed.includes('{')
  );

  if (isDirectCode) {
    return convertUserCodeToStoryboard(trimmed, language, theme, aspectRatio);
  }

  // 2. If API Key provided, call Gemini
  if (apiKey && apiKey.trim().length > 10) {
    try {
      return await callGeminiApi(trimmed, apiKey.trim(), language, theme, aspectRatio);
    } catch (err: any) {
      console.warn('Gemini API failed, falling back to smart offline generator:', err);
    }
  }

  // 3. Smart Offline Generator
  return generateSmartOfflineDemo(trimmed, language, theme, aspectRatio);
}

async function callGeminiApi(
  prompt: string,
  apiKey: string,
  language: string,
  theme: EditorTheme,
  aspectRatio: AspectRatio
): Promise<Storyboard> {
  const systemPrompt = `Bạn là chuyên gia lập trình và đạo diễn video hướng dẫn code chuyên nghiệp.
Nhiệm vụ: Chuyển đổi yêu cầu "${prompt}" thành một Storyboard Video Demo code dạng JSON.

Quy tắc quan trọng:
1. Thời lượng & Tốc độ gõ: Video diễn ra chậm rãi, nhịp nhàng từng dòng để người xem kịp đọc và hiểu. Mỗi phân cảnh code kéo dài từ 270 đến 360 frames (9 đến 12 giây).
2. Lời thuyết minh (speakerScript): Phải là một đoạn văn hoàn chỉnh (2 đến 4 câu chi tiết tiếng Việt), giải thích cặn kẽ từng dòng lệnh bên trong đang làm gì, tại sao viết như vậy và ý nghĩa của khối code. TUYỆT ĐỐI KHÔNG viết cụt lủn 1 câu ngắn.
3. Chia thành 2 - 3 Scene mạch lạc (tối đa 12 dòng code mỗi cảnh).

Chỉ trả về DUY NHẤT một JSON hợp lệ tuân thủ cấu trúc sau:
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
      "highlightLines": [1, 2],
      "zoomScale": 1.1,
      "focusLine": 1,
      "speakerScript": "Đoạn văn thuyết minh đầy đủ 2-4 câu giải thích chi tiết toàn bộ logic code bên trong...",
      "durationInFrames": 300
    },
    {
      "id": "scene-2",
      "type": "terminal",
      "title": "Chạy thử kết quả",
      "command": "${language === 'python' ? 'python main.py' : 'node main.js'}",
      "output": "kết quả in ra terminal...",
      "speakerScript": "Đoạn văn thuyết minh phân tích kết quả chạy được...",
      "durationInFrames": 210
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

function convertUserCodeToStoryboard(
  rawCode: string,
  language: string,
  theme: EditorTheme,
  aspectRatio: AspectRatio
): Storyboard {
  const lines = rawCode.split('\n');
  const filename = language === 'python' ? 'main.py' : language === 'typescript' ? 'index.ts' : 'app.js';

  if (lines.length <= 6) {
    return {
      title: `Demo mã nguồn ${language.toUpperCase()}`,
      description: `Video hướng dẫn và thực thi đoạn code ${language}`,
      aspectRatio,
      theme,
      fps: 30,
      scenes: [
        {
          id: 'user-sc-1',
          type: 'editor',
          title: 'Triển khai mã nguồn',
          filename,
          language,
          code: rawCode,
          highlightLines: [1, Math.min(lines.length, 3)],
          zoomScale: 1.1,
          focusLine: 1,
          speakerScript: `Đây là toàn bộ đoạn mã nguồn ${language.toUpperCase()} chúng ta đã triển khai. Các bạn hãy quan sát kỹ cấu trúc khai báo và luồng xử lý dữ liệu từ đầu đến cuối của hàm này.`,
          durationInFrames: Math.max(270, lines.length * 50 + 90)
        },
        {
          id: 'user-sc-2',
          type: 'terminal',
          title: 'Kết quả chạy thử',
          command: language === 'python' ? `python ${filename}` : `node ${filename}`,
          output: `[INFO] Đang chạy ${filename}...\n[SUCCESS] Thực thi hoàn tất không có lỗi.\nKết quả trả về hợp lệ.`,
          speakerScript: 'Sau khi chạy chương trình trên terminal, kết quả được tính toán và in ra một cách chính xác theo đúng mong muốn.',
          durationInFrames: 210
        }
      ]
    };
  }

  const midPoint = Math.floor(lines.length / 2);
  const part1 = lines.slice(0, midPoint).join('\n');
  const part2 = rawCode;

  return {
    title: `Demo mã nguồn ${language.toUpperCase()}`,
    description: `Video hướng dẫn từng bước viết và thực thi code ${language}`,
    aspectRatio,
    theme,
    fps: 30,
    scenes: [
      {
        id: 'user-sc-1',
        type: 'editor',
        title: 'Phần 1: Khởi tạo và khai báo logic',
        filename,
        language,
        code: part1,
        highlightLines: [1, 2],
        zoomScale: 1.1,
        focusLine: 1,
        speakerScript: `Ở phần đầu tiên, chúng ta khai báo cấu trúc hàm và thiết lập các biến điều kiện khởi tạo ban đầu để chuẩn bị cho thuật toán xử lý dữ liệu.`,
        durationInFrames: 300
      },
      {
        id: 'user-sc-2',
        type: 'editor',
        title: 'Phần 2: Hoàn thiện logic xử lý',
        filename,
        language,
        code: part2,
        highlightLines: [midPoint + 1, midPoint + 2],
        zoomScale: 1.15,
        focusLine: midPoint + 1,
        speakerScript: `Tiếp theo, chúng ta hoàn thiện phần thân xử lý, tính toán các điều kiện logic và trả về kết quả cuối cùng của chương trình.`,
        durationInFrames: 360
      },
      {
        id: 'user-sc-3',
        type: 'terminal',
        title: 'Phần 3: Chạy thử trên Terminal',
        command: language === 'python' ? `python ${filename}` : `node ${filename}`,
        output: `[INFO] Đang chạy ${filename}...\n[SUCCESS] Chương trình chạy mượt mà, trả về kết quả chính xác.`,
        speakerScript: 'Chạy thử nghiệm trên terminal, toàn bộ mã nguồn hoạt động chính xác và không có bất kỳ lỗi nào phát sinh.',
        durationInFrames: 210
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
          highlightLines: [2, 3, 4],
          zoomScale: 1.1,
          focusLine: 2,
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
        highlightLines: [3, 4, 5, 6],
        zoomScale: 1.15,
        focusLine: 4,
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
