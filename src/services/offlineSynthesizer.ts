import { Storyboard, Scene, EditorTheme, AspectRatio } from '../types';

/**
 * Intelligent Offline Synthesizer for High-Speed Generation
 */
export function generateSmartOfflineDemo(
  prompt: string,
  language: string,
  theme: EditorTheme,
  aspectRatio: AspectRatio
): Storyboard {
  const lower = prompt.toLowerCase();

  // 1. FastAPI Production Configuration (Lifespan, CORS, GZip, Middleware, Health Check)
  if (lower.includes('cấu hình') && lower.includes('fastapi')) {
    return generateFastApiConfigDemo(theme, aspectRatio);
  }

  // 2. RESTful CRUD API (FastAPI / Express)
  if (lower.includes('crud') || lower.includes('api') || lower.includes('rest')) {
    return generateCrudApiDemo(language, theme, aspectRatio);
  }

  // 3. React Custom Hooks (useCounter, useFetch, useDebounce)
  if (lower.includes('react') || lower.includes('hook') || lower.includes('usecounter') || lower.includes('counter')) {
    return generateReactHookDemo(theme, aspectRatio);
  }

  // 4. Game / Logic demo (Number Guessing, Random, While loop)
  if (lower.includes('đoán số') || lower.includes('trò chơi') || lower.includes('game') || lower.includes('random')) {
    return generateNumberGuessingDemo(theme, aspectRatio);
  }

  // 5. Fibonacci / Dynamic Programming / Recursion
  if (lower.includes('fibonacci') || lower.includes('fibo') || lower.includes('đệ quy') || lower.includes('dynamic programming')) {
    return generateFibonacciDemo(theme, aspectRatio);
  }

  // 6. Generic Algorithm Synthesizer
  return generateGenericAlgorithmDemo(prompt, language, theme, aspectRatio);
}

function generateFastApiConfigDemo(theme: EditorTheme, aspectRatio: AspectRatio): Storyboard {
  const filename = 'main.py';
  return {
    title: 'Cấu Hình Nâng Cao FastAPI Production',
    description: 'Video chuyên sâu 48 dòng code: Lifespan Context Manager, CORS, GZip, Custom Middleware & Health Check',
    aspectRatio,
    theme,
    fps: 30,
    scenes: [
      {
        id: 'cfg-sc-1',
        type: 'editor',
        title: 'Khởi tạo Thư viện & Lifespan Context Manager',
        filename,
        language: 'python',
        code: `import time\nimport logging\nfrom contextlib import asynccontextmanager\nfrom fastapi import FastAPI, Request, status\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom fastapi.middleware.gzip import GZipMiddleware\nfrom fastapi.responses import JSONResponse\n\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger("production_api")\n\n@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    # Khởi tạo kết nối Database & Cache Pool\n    logger.info(">> [STARTUP] Kết nối Database Pool & Redis thành công...")\n    yield\n    # Dọn dẹp tài nguyên khi tắt server\n    logger.info(">> [SHUTDOWN] Đóng toàn bộ kết nối Database & giải phóng tài nguyên...")`,
        startTypingFromLine: 1,
        highlightLines: [11, 12, 14, 17],
        zoomScale: 1.08,
        focusLine: 12,
        speakerScript:
          'Chào các bạn! Trong video này chúng ta sẽ cùng xây dựng cấu hình FastAPI chuẩn Production 48 dòng code. Đầu tiên, chúng ta import đầy đủ các module và triển khai Lifespan Context Manager bằng asynccontextmanager để quản lý chu kỳ sống của ứng dụng, kết nối cơ sở dữ liệu và dọn dẹp tài nguyên khi tắt server.',
        durationInFrames: 330
      },
      {
        id: 'cfg-sc-2',
        type: 'editor',
        title: 'Khởi tạo App & Thiết lập Bộ Lọc CORS & GZip Compression',
        filename,
        language: 'python',
        code: `import time\nimport logging\nfrom contextlib import asynccontextmanager\nfrom fastapi import FastAPI, Request, status\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom fastapi.middleware.gzip import GZipMiddleware\nfrom fastapi.responses import JSONResponse\n\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger("production_api")\n\n@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    # Khởi tạo kết nối Database & Cache Pool\n    logger.info(">> [STARTUP] Kết nối Database Pool & Redis thành công...")\n    yield\n    # Dọn dẹp tài nguyên khi tắt server\n    logger.info(">> [SHUTDOWN] Đóng toàn bộ kết nối Database & giải phóng tài nguyên...")\n\napp = FastAPI(\n    title="Enterprise Production API",\n    version="2.0.0",\n    lifespan=lifespan,\n    docs_url="/api/docs"\n)\n\n# 1. Bảo mật CORS cho phép Frontend giao tiếp an toàn\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=["https://yourdomain.com", "http://localhost:3000"],\n    allow_credentials=True,\n    allow_methods=["GET", "POST", "PUT", "DELETE"],\n    allow_headers=["*"],\n)\n\n# 2. Nén dữ liệu GZip tối ưu băng thông cho response > 1KB\napp.add_middleware(GZipMiddleware, minimum_size=1000)`,
        startTypingFromLine: 19,
        highlightLines: [19, 28, 29, 36],
        zoomScale: 1.12,
        focusLine: 28,
        speakerScript:
          'Tiếp theo, ta khởi tạo instance FastAPI với lifespan và gắn hai tầng middleware tiêu chuẩn: CORSMiddleware giúp bảo vệ API và kiểm soát nguồn gốc truy cập, cùng GZipMiddleware tự động nén dữ liệu cho các phản hồi trên 1000 bytes nhằm tiết kiệm băng thông mạng.',
        durationInFrames: 360
      },
      {
        id: 'cfg-sc-3',
        type: 'editor',
        title: 'Custom Middleware Đo Thời Gian & Endpoint /health',
        filename,
        language: 'python',
        code: `import time\nimport logging\nfrom contextlib import asynccontextmanager\nfrom fastapi import FastAPI, Request, status\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom fastapi.middleware.gzip import GZipMiddleware\nfrom fastapi.responses import JSONResponse\n\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger("production_api")\n\n@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    # Khởi tạo kết nối Database & Cache Pool\n    logger.info(">> [STARTUP] Kết nối Database Pool & Redis thành công...")\n    yield\n    # Dọn dẹp tài nguyên khi tắt server\n    logger.info(">> [SHUTDOWN] Đóng toàn bộ kết nối Database & giải phóng tài nguyên...")\n\napp = FastAPI(\n    title="Enterprise Production API",\n    version="2.0.0",\n    lifespan=lifespan,\n    docs_url="/api/docs"\n)\n\n# 1. Bảo mật CORS cho phép Frontend giao tiếp an toàn\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=["https://yourdomain.com", "http://localhost:3000"],\n    allow_credentials=True,\n    allow_methods=["GET", "POST", "PUT", "DELETE"],\n    allow_headers=["*"],\n)\n\n# 2. Nén dữ liệu GZip tối ưu băng thông cho response > 1KB\napp.add_middleware(GZipMiddleware, minimum_size=1000)\n\n# 3. Custom Middleware tính thời gian thực thi request\n@app.middleware("http")\nasync def add_process_time_header(request: Request, call_next):\n    start_time = time.perf_counter()\n    response = await call_next(request)\n    process_time = time.perf_counter() - start_time\n    response.headers["X-Process-Time-Sec"] = f"{process_time:.6f}"\n    logger.info(f"[{request.method}] {request.url.path} - {response.status_code} ({process_time:.4f}s)")\n    return response\n\n# 4. Endpoint Health Check cho Load Balancer & Kubernetes\n@app.get("/health", tags=["Monitoring"], status_code=status.HTTP_200_OK)\nasync def health_check():\n    return {\n        "status": "healthy",\n        "timestamp": time.time(),\n        "database": "connected",\n        "cache": "ready"\n    }`,
        startTypingFromLine: 38,
        highlightLines: [39, 41, 44, 49, 51],
        zoomScale: 1.1,
        focusLine: 41,
        speakerScript:
          'Cuối cùng, chúng ta cài đặt một Custom HTTP Middleware để tự động đo lường chính xác thời gian xử lý và đính kèm header X-Process-Time-Sec, đồng thời tạo endpoint /health trả về trạng thái Database và Cache phục vụ cho Kubernetes và Load Balancer giám sát liên tục.',
        durationInFrames: 390
      },
      {
        id: 'cfg-sc-4',
        type: 'terminal',
        title: 'Khởi chạy Uvicorn Server & Test Endpoint /health',
        command: 'uvicorn main:app --host 0.0.0.0 --port 8000 --reload',
        output: `INFO:     Started server process [18420]\nINFO:     Waiting for application startup.\nINFO:     >> [STARTUP] Kết nối Database Pool & Redis thành công...\nINFO:     Application startup complete. Uvicorn running on http://0.0.0.0:8000\nINFO:     [GET] /health - 200 (0.0012s)\n{\n  "status": "healthy",\n  "timestamp": 1724659200,\n  "database": "connected",\n  "cache": "ready"\n}\n[SUCCESS] Header X-Process-Time-Sec: 0.001204s`,
        speakerScript:
          'Bây giờ, chúng ta chạy lệnh uvicorn main:app. Server khởi động và kích hoạt lifespan kết nối Database ngay lập tức. Khi gọi thử nghiệm endpoint /health, kết quả trả về mã 200 OK với thời gian xử lý siêu tốc chỉ 1.2 mili-giây!',
        durationInFrames: 270
      }
    ]
  };
}

function generateCrudApiDemo(language: string, theme: EditorTheme, aspectRatio: AspectRatio): Storyboard {
  const isPython = language === 'python';
  const filename = isPython ? 'api.py' : 'server.js';

  if (isPython) {
    return {
      title: 'RESTful CRUD API với Python FastAPI & Pydantic',
      description: 'Video demo xây dựng trọn bộ RESTful API CRUD (GET, POST, PUT, DELETE) với FastAPI và validation Pydantic',
      aspectRatio,
      theme,
      fps: 30,
      scenes: [
        {
          id: 'crud-py-1',
          type: 'editor',
          title: 'Khởi tạo Schema Dữ liệu với Pydantic',
          filename,
          language: 'python',
          code: `from fastapi import FastAPI, HTTPException, status\nfrom pydantic import BaseModel, Field\nfrom typing import List, Optional\n\napp = FastAPI(title="Product Management API")\n\n# Khai báo Schema Pydantic để validate dữ liệu đầu vào\nclass Product(BaseModel):\n    id: int\n    name: str = Field(..., min_length=2, max_length=100)\n    price: float = Field(..., gt=0)\n    in_stock: bool = True\n\n# Cơ sở dữ liệu in-memory mẫu\ndb: List[Product] = [\n    Product(id=1, name="Bàn phím cơ Custom", price=129.99),\n    Product(id=2, name="Chuột không dây công thái học", price=79.50)\n]`,
          startTypingFromLine: 1,
          highlightLines: [8, 9, 10, 15],
          zoomScale: 1.1,
          focusLine: 8,
          speakerScript:
            'Chào các bạn! Hôm nay chúng ta sẽ cùng xây dựng một hệ thống RESTful CRUD API hoàn chỉnh với FastAPI. Đầu tiên, chúng ta định nghĩa Schema Product bằng Pydantic với các ràng buộc về độ dài tên và giá tiền lớn hơn không, cùng danh sách dữ liệu mẫu ban đầu.',
          durationInFrames: 330
        },
        {
          id: 'crud-py-2',
          type: 'editor',
          title: 'Cài đặt Endpoint Lấy danh sách (GET) & Thêm mới (POST)',
          filename,
          language: 'python',
          code: `from fastapi import FastAPI, HTTPException, status\nfrom pydantic import BaseModel, Field\nfrom typing import List, Optional\n\napp = FastAPI(title="Product Management API")\n\nclass Product(BaseModel):\n    id: int\n    name: str = Field(..., min_length=2, max_length=100)\n    price: float = Field(..., gt=0)\n    in_stock: bool = True\n\ndb: List[Product] = [\n    Product(id=1, name="Bàn phím cơ Custom", price=129.99),\n    Product(id=2, name="Chuột không dây công thái học", price=79.50)\n]\n\n# GET: Lấy danh sách toàn bộ sản phẩm\n@app.get("/products", response_model=List[Product])\ndef get_all_products():\n    return db\n\n# POST: Tạo mới một sản phẩm và kiểm tra trùng ID\n@app.post("/products", response_model=Product, status_code=status.HTTP_201_CREATED)\ndef create_product(item: Product):\n    if any(p.id == item.id for p in db):\n        raise HTTPException(status_code=400, detail="ID sản phẩm đã tồn tại")\n    db.append(item)\n    return item`,
          startTypingFromLine: 18,
          highlightLines: [19, 24, 26, 28],
          zoomScale: 1.12,
          focusLine: 24,
          speakerScript:
            'Tiếp theo, chúng ta viết hàm GET /products để trả về toàn bộ danh sách, và hàm POST /products nhận dữ liệu từ request body. Nếu phát hiện ID đã tồn tại trong hệ thống, ta trả về lỗi HTTP 400 ngay lập tức.',
          durationInFrames: 360
        },
        {
          id: 'crud-py-3',
          type: 'editor',
          title: 'Cài đặt Endpoint Cập nhật (PUT) & Xóa (DELETE)',
          filename,
          language: 'python',
          code: `from fastapi import FastAPI, HTTPException, status\nfrom pydantic import BaseModel, Field\nfrom typing import List, Optional\n\napp = FastAPI(title="Product Management API")\n\nclass Product(BaseModel):\n    id: int\n    name: str = Field(..., min_length=2, max_length=100)\n    price: float = Field(..., gt=0)\n    in_stock: bool = True\n\ndb: List[Product] = [\n    Product(id=1, name="Bàn phím cơ Custom", price=129.99),\n    Product(id=2, name="Chuột không dây công thái học", price=79.50)\n]\n\n@app.get("/products", response_model=List[Product])\ndef get_all_products():\n    return db\n\n@app.post("/products", response_model=Product, status_code=status.HTTP_201_CREATED)\ndef create_product(item: Product):\n    if any(p.id == item.id for p in db):\n        raise HTTPException(status_code=400, detail="ID sản phẩm đã tồn tại")\n    db.append(item)\n    return item\n\n# PUT: Cập nhật thông tin sản phẩm theo ID\n@app.put("/products/{product_id}", response_model=Product)\ndef update_product(product_id: int, updated: Product):\n    for idx, p in enumerate(db):\n        if p.id == product_id:\n            db[idx] = updated\n            return updated\n    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")\n\n# DELETE: Xóa sản phẩm khỏi cơ sở dữ liệu\n@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)\ndef delete_product(product_id: int):\n    for idx, p in enumerate(db):\n        if p.id == product_id:\n            db.pop(idx)\n            return\n    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")`,
          startTypingFromLine: 31,
          highlightLines: [32, 35, 41, 44],
          zoomScale: 1.1,
          focusLine: 35,
          speakerScript:
            'Cuối cùng, chúng ta hoàn thiện hai phương thức PUT để cập nhật thông tin và DELETE để xóa sản phẩm theo ID với mã phản hồi chuẩn RESTful 204 No Content khi thao tác thành công.',
          durationInFrames: 360
        },
        {
          id: 'crud-py-4',
          type: 'terminal',
          title: 'Khởi chạy Server & Kiểm thử API với PyTest / cURL',
          command: 'pytest -v test_api.py',
          output: `==================== test session starts ====================\ntest_api.py::test_get_products PASSED                  [ 25%]\ntest_api.py::test_create_product PASSED                [ 50%]\ntest_api.py::test_update_product PASSED                [ 75%]\ntest_api.py::test_delete_product PASSED                [100%]\n\n==================== 4 passed in 0.28s =====================`,
          speakerScript:
            'Bây giờ, hãy mở terminal và chạy test suite tự động. Toàn bộ 4 test case cho GET, POST, PUT, DELETE đều vượt qua với tốc độ phản hồi cực kỳ ấn tượng.',
          durationInFrames: 240
        }
      ]
    };
  } else {
    // JavaScript Express CRUD Demo
    return {
      title: 'RESTful API CRUD với Node.js & Express',
      description: 'Video demo xây dựng đầy đủ các endpoint GET, POST, PUT, DELETE trên nền tảng Express.js',
      aspectRatio,
      theme,
      fps: 30,
      scenes: [
        {
          id: 'crud-js-1',
          type: 'editor',
          title: 'Khởi tạo Express Server & Middleware JSON',
          filename,
          language: 'javascript',
          code: `const express = require('express');\nconst app = express();\napp.use(express.json());\n\n// Dữ liệu mẫu lưu trữ trong bộ nhớ\nlet users = [\n  { id: 1, name: 'Nguyễn Văn A', role: 'Admin' },\n  { id: 2, name: 'Trần Thị B', role: 'User' }\n];`,
          startTypingFromLine: 1,
          highlightLines: [1, 3, 6],
          zoomScale: 1.1,
          focusLine: 3,
          speakerScript:
            'Xin chào các bạn! Hôm nay chúng ta sẽ cùng viết một ứng dụng RESTful API với Express.js. Đầu tiên, ta import thư viện express, kích hoạt middleware express.json để phân tích dữ liệu body, và tạo mảng users mẫu.',
          durationInFrames: 300
        },
        {
          id: 'crud-js-2',
          type: 'editor',
          title: 'Cài đặt Route Lấy danh sách & Thêm người dùng mới',
          filename,
          language: 'javascript',
          code: `const express = require('express');\nconst app = express();\napp.use(express.json());\n\nlet users = [\n  { id: 1, name: 'Nguyễn Văn A', role: 'Admin' },\n  { id: 2, name: 'Trần Thị B', role: 'User' }\n];\n\n// GET: Lấy danh sách người dùng\napp.get('/api/users', (req, res) => {\n  res.json({ success: true, data: users });\n});\n\n// POST: Thêm người dùng mới\napp.post('/api/users', (req, res) => {\n  const { name, role } = req.body;\n  if (!name) return res.status(400).json({ error: 'Tên không được để trống' });\n  const newUser = { id: Date.now(), name, role: role || 'User' };\n  users.push(newUser);\n  res.status(201).json({ success: true, data: newUser });\n});`,
          startTypingFromLine: 10,
          highlightLines: [11, 16, 18, 20],
          zoomScale: 1.12,
          focusLine: 16,
          speakerScript:
            'Tiếp theo, chúng ta viết route GET /api/users và route POST /api/users. Trong route POST, ta kiểm tra nếu thiếu trường tên sẽ trả về mã lỗi 400 Bad Request, ngược lại sẽ tạo ID mới và lưu vào mảng.',
          durationInFrames: 330
        },
        {
          id: 'crud-js-3',
          type: 'editor',
          title: 'Cài đặt Route Xóa (DELETE) & Lắng nghe Port',
          filename,
          language: 'javascript',
          code: `const express = require('express');\nconst app = express();\napp.use(express.json());\n\nlet users = [\n  { id: 1, name: 'Nguyễn Văn A', role: 'Admin' },\n  { id: 2, name: 'Trần Thị B', role: 'User' }\n];\n\napp.get('/api/users', (req, res) => {\n  res.json({ success: true, data: users });\n});\n\napp.post('/api/users', (req, res) => {\n  const { name, role } = req.body;\n  if (!name) return res.status(400).json({ error: 'Tên không được để trống' });\n  const newUser = { id: Date.now(), name, role: role || 'User' };\n  users.push(newUser);\n  res.status(201).json({ success: true, data: newUser });\n});\n\n// DELETE: Xóa người dùng theo ID\napp.delete('/api/users/:id', (req, res) => {\n  const id = parseInt(req.params.id, 10);\n  users = users.filter(u => u.id !== id);\n  res.json({ success: true, message: 'Đã xóa thành công' });\n});\n\nconst PORT = 3000;\napp.listen(PORT, () => console.log(\`Server chạy tại http://localhost:\${PORT}\`));`,
          startTypingFromLine: 23,
          highlightLines: [24, 26, 30],
          zoomScale: 1.1,
          focusLine: 24,
          speakerScript:
            'Cuối cùng, chúng ta định nghĩa route DELETE /api/users/:id sử dụng phương thức filter để xóa bản ghi, sau đó kích hoạt server lắng nghe tại cổng 3000.',
          durationInFrames: 330
        },
        {
          id: 'crud-js-4',
          type: 'terminal',
          title: 'Chạy thử Server & Gọi cURL Test',
          command: 'node server.js',
          output: `Server chạy tại http://localhost:3000\n>> [POST] /api/users 201 Created (12ms)\n>> [GET] /api/users 200 OK (3ms)\n>> Response: { "success": true, "data": [ { "id": 1, "name": "Nguyễn Văn A" }, { "id": 1724601, "name": "Lê Văn C" } ] }`,
          speakerScript:
            'Hãy bật terminal lên và chạy node server.js. Server đã online sẵn sàng tiếp nhận request và trả về dữ liệu chuẩn JSON.',
          durationInFrames: 240
        }
      ]
    };
  }
}

function generateReactHookDemo(theme: EditorTheme, aspectRatio: AspectRatio): Storyboard {
  const filename = 'useCounter.ts';
  return {
    title: 'Custom Hook useCounter trong React & TypeScript',
    description: 'Video demo xây dựng Custom React Hook quản lý bộ đếm có giới hạn min/max và các hàm thao tác tiện ích',
    aspectRatio,
    theme,
    fps: 30,
    scenes: [
      {
        id: 'hook-1',
        type: 'editor',
        title: 'Định nghĩa Interface và Kiểu dữ liệu Options',
        filename,
        language: 'typescript',
        code: `import { useState, useCallback } from 'react';\n\n// Định nghĩa các tùy chọn cấu hình cho hook\nexport interface UseCounterOptions {\n  min?: number;\n  max?: number;\n  step?: number;\n}`,
        startTypingFromLine: 1,
        highlightLines: [1, 4, 5, 6],
        zoomScale: 1.1,
        focusLine: 4,
        speakerScript:
          'Xin chào các bạn! Hôm nay chúng ta sẽ cùng viết một Custom Hook useCounter mạnh mẽ và tái sử dụng được trong React. Đầu tiên, ta định nghĩa interface UseCounterOptions với các thuộc tính tùy chọn như min, max và step.',
        durationInFrames: 300
      },
      {
        id: 'hook-2',
        type: 'editor',
        title: 'Cài đặt Logic Tăng, Giảm & Reset với useCallback',
        filename,
        language: 'typescript',
        code: `import { useState, useCallback } from 'react';\n\nexport interface UseCounterOptions {\n  min?: number;\n  max?: number;\n  step?: number;\n}\n\nexport function useCounter(initialValue: number = 0, options: UseCounterOptions = {}) {\n  const { min = -Infinity, max = Infinity, step = 1 } = options;\n  const [count, setCount] = useState<number>(() => Math.min(Math.max(initialValue, min), max));\n\n  const increment = useCallback(() => {\n    setCount((prev) => Math.min(prev + step, max));\n  }, [step, max]);\n\n  const decrement = useCallback(() => {\n    setCount((prev) => Math.max(prev - step, min));\n  }, [step, min]);\n\n  const reset = useCallback(() => {\n    setCount(initialValue);\n  }, [initialValue]);\n\n  return { count, increment, decrement, reset, setCount };\n}`,
        startTypingFromLine: 9,
        highlightLines: [11, 13, 17, 21, 25],
        zoomScale: 1.12,
        focusLine: 13,
        speakerScript:
          'Tiếp theo, ta dùng useState để quản lý giá trị count, đồng thời bọc các hàm increment, decrement và reset bên trong useCallback nhằm tối ưu hiệu năng render và tránh re-render không cần thiết.',
        durationInFrames: 360
      },
      {
        id: 'hook-3',
        type: 'terminal',
        title: 'Kiểm thử Custom Hook với React Testing Library',
        command: 'npm test useCounter.test.ts',
        output: `PASS src/hooks/useCounter.test.ts\n  ✓ should initialize with default value (4 ms)\n  ✓ should increment and decrement correctly (3 ms)\n  ✓ should respect min and max bounds (2 ms)\n  ✓ should reset to initial value (2 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       4 passed, 4 total`,
        speakerScript:
          'Mở terminal và chạy lệnh npm test. Tất cả các trường hợp kiểm thử biên min/max và tăng giảm đều vượt qua xuất sắc!',
        durationInFrames: 240
      }
    ]
  };
}

function generateNumberGuessingDemo(theme: EditorTheme, aspectRatio: AspectRatio): Storyboard {
  const filename = 'guess_number.py';
  return {
    title: 'Trò Chơi Đoán Số Ngẫu Nhiên trong Python',
    description: 'Video demo lập trình Game Đoán Số với thư viện random, vòng lặp while và xử lý ngoại lệ',
    aspectRatio,
    theme,
    fps: 30,
    scenes: [
      {
        id: 'game-1',
        type: 'editor',
        title: 'Khởi tạo Số Bí Mật và Số Lần Đoán',
        filename,
        language: 'python',
        code: `import random\n\ndef play_game():\n    secret_number = random.randint(1, 100)\n    attempts = 0\n    max_attempts = 7\n    print("Chào mừng đến với Trò Chơi Đoán Số (1-100)!")`,
        startTypingFromLine: 1,
        highlightLines: [1, 4, 6],
        zoomScale: 1.1,
        focusLine: 4,
        speakerScript:
          'Chào các bạn! Hôm nay chúng ta sẽ cùng viết một trò chơi Đoán Số vui nhộn trong Python. Đầu tiên, ta import thư viện random và sinh một số bí mật ngẫu nhiên trong khoảng từ 1 đến 100.',
        durationInFrames: 300
      },
      {
        id: 'game-2',
        type: 'editor',
        title: 'Vòng lặp Kiểm tra và Gợi ý Lớn hơn / Nhỏ hơn',
        filename,
        language: 'python',
        code: `import random\n\ndef play_game():\n    secret_number = random.randint(1, 100)\n    attempts = 0\n    max_attempts = 7\n    print("Chào mừng đến với Trò Chơi Đoán Số (1-100)!")\n\n    while attempts < max_attempts:\n        try:\n            guess = int(input(f"Lượt {attempts + 1}/{max_attempts} - Nhập số đoán: "))\n            attempts += 1\n\n            if guess == secret_number:\n                print(f"Chúc mừng! Bạn đã đoán đúng số {secret_number} sau {attempts} lượt.")\n                return\n            elif guess < secret_number:\n                print("Số bí mật LỚN HƠN!")\n            else:\n                print("Số bí mật NHỎ HƠN!")\n        except ValueError:\n            print("Vui lòng nhập một số nguyên hợp lệ!")\n\n    print(f"Rất tiếc! Bạn đã hết lượt. Số bí mật là: {secret_number}")`,
        startTypingFromLine: 9,
        highlightLines: [9, 11, 14, 17, 19],
        zoomScale: 1.12,
        focusLine: 14,
        speakerScript:
          'Tiếp theo, ta dùng vòng lặp while giới hạn 7 lượt chơi, sử dụng try-except để bắt lỗi khi người dùng nhập sai, đồng thời đưa ra gợi ý Lớn Hơn hoặc Nhỏ Hơn sau mỗi lần đoán.',
        durationInFrames: 360
      },
      {
        id: 'game-3',
        type: 'terminal',
        title: 'Chạy thử Game Đoán Số trên Terminal',
        command: 'python guess_number.py',
        output: `Chào mừng đến với Trò Chơi Đoán Số (1-100)!\nLượt 1/7 - Nhập số đoán: 50 -> Số bí mật LỚN HƠN!\nLượt 2/7 - Nhập số đoán: 75 -> Số bí mật NHỎ HƠN!\nLượt 3/7 - Nhập số đoán: 63 -> Số bí mật LỚN HƠN!\nLượt 4/7 - Nhập số đoán: 68 -> Chúc mừng! Bạn đã đoán đúng số 68 sau 4 lượt.`,
        speakerScript:
          'Hãy chạy lệnh python guess_number.py. Game tương tác mượt mà và tìm ra số bí mật chỉ sau 4 lượt đoán nhờ thuật toán tìm kiếm nhị phân!',
        durationInFrames: 240
      }
    ]
  };
}

function generateFibonacciDemo(theme: EditorTheme, aspectRatio: AspectRatio): Storyboard {
  const filename = 'fibonacci.py';
  return {
    title: 'Dãy Số Fibonacci Tối Ưu Memoization trong Python',
    description: 'Video demo so sánh đệ quy ngây thơ và tối ưu hóa quy hoạch động Memoization',
    aspectRatio,
    theme,
    fps: 30,
    scenes: [
      {
        id: 'fibo-1',
        type: 'editor',
        title: 'Khởi tạo Hàm Fibonacci với Bảng Nhớ Memoization',
        filename,
        language: 'python',
        code: `def fibonacci_memo(n, memo={}):\n    # Kiểm tra nếu kết quả đã được tính toán từ trước\n    if n in memo:\n        return memo[n]\n    # Trường hợp cơ sở\n    if n <= 1:\n        return n`,
        startTypingFromLine: 1,
        highlightLines: [1, 3, 4, 7],
        zoomScale: 1.1,
        focusLine: 3,
        speakerScript:
          'Xin chào các bạn! Hôm nay chúng ta sẽ cùng tối ưu hóa thuật toán tính số Fibonacci từ độ phức tạp O(2^N) xuống O(N) bằng kỹ thuật Memoization. Đầu tiên, ta kiểm tra bảng nhớ memo để lấy kết quả nếu đã tính.',
        durationInFrames: 300
      },
      {
        id: 'fibo-2',
        type: 'editor',
        title: 'Tính toán Đệ quy và Lưu trữ Kết quả',
        filename,
        language: 'python',
        code: `def fibonacci_memo(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n\n    # Lưu kết quả đệ quy vào bảng nhớ để tái sử dụng\n    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)\n    return memo[n]\n\n# In ra 10 số đầu tiên của dãy Fibonacci\nresult = [fibonacci_memo(i) for i in range(10)]\nprint("10 số Fibonacci đầu tiên:", result)\nprint("Số Fibonacci thứ 50:", fibonacci_memo(50))`,
        startTypingFromLine: 8,
        highlightLines: [8, 12, 13, 14],
        zoomScale: 1.12,
        focusLine: 8,
        speakerScript:
          'Sau đó, ta tính tổng của hai số liền trước, lưu ngay vào memo và trả về kết quả. Nhờ vậy, ngay cả số Fibonacci thứ 50 cũng được tính ra chỉ trong chớp mắt.',
        durationInFrames: 330
      },
      {
        id: 'fibo-3',
        type: 'terminal',
        title: 'Kiểm chứng Tốc độ Thực thi trên Terminal',
        command: 'python fibonacci.py',
        output: `10 số Fibonacci đầu tiên: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\nSố Fibonacci thứ 50: 12586269025\n[SUCCESS] Thời gian thực thi: 0.00008s (Siêu tốc O(N))`,
        speakerScript:
          'Chạy thử nghiệm trên terminal: Số Fibonacci thứ 50 là 12.5 tỷ được tính toán trong chưa đầy 0.1 mili-giây!',
        durationInFrames: 240
      }
    ]
  };
}

function generateGenericAlgorithmDemo(
  prompt: string,
  language: string,
  theme: EditorTheme,
  aspectRatio: AspectRatio
): Storyboard {
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
        speakerScript: `Cuối cùng, chúng ta chạy thử nghiệm trên Terminal để kiểm chứng kết quả. Mã nguồn thực thi chuẩn xác và tối ưu!`,
        durationInFrames: 240
      }
    ]
  };
}
