import fs from 'fs';

const advancedFastApiCode = `from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time

# 1. Lifespan Event Handler (Startup & Shutdown)
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] Kết nối Database Pool và nạp Redis Cache...")
    yield
    print("[SHUTDOWN] Đóng kết nối Database an toàn!")

# 2. Khởi tạo FastAPI App với Metadata
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
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 4. Middleware đo thời gian xử lý Request (Process Time)
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
    }`;

async function runAdvancedTest() {
  const { generateStoryboardWithAI } = await import('./src/services/aiService.ts');

  console.log("==================================================================");
  console.log("🚀 TESTING ADVANCED FASTAPI CONFIGURATION (48-Line Production Setup)");
  console.log("==================================================================");

  const result = await generateStoryboardWithAI(advancedFastApiCode, '', 'python');
  const sb = result.storyboard;

  console.log(`📌 Generated Title: "${sb.title}"`);
  console.log(`📌 Total Scenes: ${sb.scenes.length}`);

  let allValid = true;

  sb.scenes.forEach((sc, i) => {
    console.log(`\n--- Scene ${i + 1} [${sc.type.toUpperCase()}]: "${sc.title}" ---`);
    if (sc.type === 'editor') {
      const lineCount = sc.code.split('\n').length;
      console.log(`  📝 Total Lines: ${lineCount} | Typing From: ${sc.startTypingFromLine}`);
      console.log(`  🔦 Highlight Lines: [${sc.highlightLines.join(', ')}]`);
      console.log(`  🎯 Focus Line: ${sc.focusLine}`);
      console.log(`  ⏱️ Duration: ${sc.durationInFrames} frames (${(sc.durationInFrames / 30).toFixed(1)}s)`);
      console.log(`  🎙️ Speaker Script: "${sc.speakerScript}"`);

      // Validation
      for (const hl of sc.highlightLines) {
        if (hl > lineCount || hl < 1) {
          console.error(`  ❌ Error: Highlight line ${hl} exceeds code length ${lineCount}`);
          allValid = false;
        }
      }
    } else {
      console.log(`  💻 Command: ${sc.command}`);
      console.log(`  📤 Output Preview:\n${sc.output.split('\n').map(l => '     ' + l).join('\n')}`);
      console.log(`  🎙️ Speaker Script: "${sc.speakerScript}"`);
    }
  });

  if (allValid) {
    console.log("\n==================================================================");
    console.log("✅ RESULT: ADVANCED FASTAPI TEST PASSED WITH 100% PRECISION!");
    console.log("==================================================================\n");
  }
}

runAdvancedTest();
