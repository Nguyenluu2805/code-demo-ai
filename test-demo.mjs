import { PRESET_TEMPLATES, generateStoryboardWithAI } from './src/services/aiService.ts';
import { generateMarkdownScript, generateSrtContent } from './src/services/exportService.ts';
import fs from 'fs';
import path from 'path';

async function runTest() {
  console.log('🚀 Bắt đầu kiểm tra kịch bản Demo Code với AI...');

  // Test 1: Tạo kịch bản cho thuật toán Binary Search bằng Python
  const prompt = 'Viết hàm Binary Search tìm kiếm nhị phân trong Python và chạy thử';
  console.log(`📝 Yêu cầu: "${prompt}"`);

  const storyboard = await generateStoryboardWithAI(prompt, undefined, 'python', 'one-dark', '16:9');
  console.log(`✅ Đã tạo thành công Storyboard: "${storyboard.title}"`);
  console.log(`📊 Số phân cảnh: ${storyboard.scenes.length}`);
  
  storyboard.scenes.forEach((sc, idx) => {
    console.log(`   👉 Cảnh ${idx + 1} (${sc.type}): ${sc.title} | Thời lượng: ${(sc.durationInFrames / storyboard.fps).toFixed(1)}s`);
    console.log(`      Thuyết minh: "${sc.speakerScript}"`);
  });

  // Test 2: Xuất file kịch bản thuyết trình Markdown
  const mdContent = generateMarkdownScript(storyboard);
  const outDir = path.resolve('./out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const mdPath = path.join(outDir, 'demo_binary_search_script.md');
  fs.writeFileSync(mdPath, mdContent, 'utf-8');
  console.log(`📄 Đã xuất file Kịch bản thuyết trình: ${mdPath}`);

  // Test 3: Xuất file phụ đề SRT
  const srtContent = generateSrtContent(storyboard);
  const srtPath = path.join(outDir, 'demo_binary_search_subtitles.srt');
  fs.writeFileSync(srtPath, srtContent, 'utf-8');
  console.log(`💬 Đã xuất file Phụ đề chuẩn SRT: ${srtPath}`);

  // Test 4: Xuất file cấu hình JSON
  const jsonPath = path.join(outDir, 'demo_binary_search_project.json');
  fs.writeFileSync(jsonPath, JSON.stringify(storyboard, null, 2), 'utf-8');
  console.log(`📦 Đã xuất file Cấu hình JSON: ${jsonPath}`);

  console.log('\n🎉 TẤT CẢ KIỂM THỬ ĐỀU THÀNH CÔNG RỰC RỠ!');
}

runTest().catch(console.error);
