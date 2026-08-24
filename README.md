# 🎬 AutoCodeDemo AI - Trình Tạo Video Demo Code & Kịch Bản Thuyết Trình Tự Động

Ứng dụng giúp bạn tự động tạo video quay màn hình gõ code (Screen Recording Simulation) kèm theo kịch bản thuyết trình từng giây và file phụ đề đồng bộ chính xác.

---

## ✨ Tính Năng Nổi Bật

1. **AI Auto-Scripting (Tự động hóa kịch bản)**:
   - Nhập bất kỳ prompt hoặc dán code (Python, TypeScript, JavaScript, Bash...).
   - AI tự động phân cảnh (Scenes), xác định dòng cần gõ, dòng highlight, zoom focus và lệnh chạy terminal.
   - Hỗ trợ cả chế độ Online (Google Gemini API) và chế độ Offline (mẫu có sẵn / thuật toán sinh thông minh).

2. **Giao Diện Render Video Chuyên Nghiệp (Remotion Core)**:
   - Khung cửa sổ macOS hiện đại (nút điều khiển, tab file, thanh trạng thái VS Code).
   - Hiệu ứng gõ phím chân thực (Typewriter effect) kèm con trỏ nhấp nháy.
   - Tô màu cú pháp chuẩn xác với Prism / Shiki.
   - Hiệu ứng phóng to mượt mà (Camera Zoom) vào trọng tâm đoạn code đang giải thích.
   - Cửa sổ Terminal hiển thị dòng lệnh và kết quả thực thi sinh động.

3. **Xuất Kịch Bản & Phụ Đề Chuẩn (Export Center)**:
   - **File Markdown (`.md`)**: Danh sách mốc thời gian `[00:00 - 00:05]`, mã nguồn và câu thuyết minh chi tiết cho người thuyết trình đọc.
   - **File Phụ Đề (`.srt`)**: Chuẩn phụ đề video để gắn lên YouTube, TikTok, CapCut, Premiere...
   - **File Cấu Hình (`.json`)**: Lưu trữ và tái sử dụng project.

---

## 🚀 Hướng Dẫn Chạy Ứng Dụng

### 1. Khởi động Web UI (Live Preview & Editor)
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

### 2. Render Video MP4 chất lượng cao bằng Remotion CLI
```bash
npx remotion render src/remotion/Root.tsx CodeDemo out/video.mp4
```

---

## 🛠️ Cấu Trúc Dự Án
```text
code-demo-ai/
├── src/
│   ├── components/       # Giao diện Dashboard, Timeline Editor, Export Modal
│   ├── remotion/         # Bộ Video Engine (CodeEditor, Terminal, Subtitles, WindowChrome)
│   ├── services/         # AI Service (Gemini API), Export Service (SRT, Markdown)
│   ├── types.ts          # Định nghĩa TypeScript
│   ├── App.tsx           # Dashboard chính
│   └── main.tsx
├── package.json
└── vite.config.ts
```
