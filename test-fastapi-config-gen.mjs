function generateFastApiConfigDemo(theme, aspectRatio) {
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

console.log("Generated Title:", generateFastApiConfigDemo('one-dark', '16:9').title);
console.log("Total Scenes:", generateFastApiConfigDemo('one-dark', '16:9').scenes.length);
