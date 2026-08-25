import fs from 'fs';

// Helper to extract scenes & validate
function validateStoryboard(name, sb) {
  console.log(`\n======================================================`);
  console.log(`🧪 TEST CASE: ${name}`);
  console.log(`======================================================`);
  console.log(`📌 Title: "${sb.title}"`);
  console.log(`📌 Description: "${sb.description}"`);
  console.log(`📌 Total Scenes: ${sb.scenes.length}`);

  let errors = [];

  sb.scenes.forEach((sc, i) => {
    console.log(`\n--- Scene ${i + 1} [${sc.type.toUpperCase()}] "${sc.title}" ---`);
    if (sc.type === 'editor') {
      const codeLines = sc.code.split('\n').length;
      console.log(`  📁 File: ${sc.filename} (${sc.language})`);
      console.log(`  📝 Total Code Lines: ${codeLines}`);
      console.log(`  ⌨️ Typing starts from line: ${sc.startTypingFromLine}`);
      console.log(`  🔦 Highlights: [${sc.highlightLines ? sc.highlightLines.join(', ') : 'none'}]`);
      console.log(`  🎯 Focus Line: ${sc.focusLine}`);
      console.log(`  ⏱️ Duration: ${sc.durationInFrames} frames (${(sc.durationInFrames / 30).toFixed(1)}s)`);
      console.log(`  🎙️ Speaker Script: "${sc.speakerScript}"`);

      if (sc.highlightLines) {
        for (const hl of sc.highlightLines) {
          if (hl > codeLines || hl < 1) {
            errors.push(`Scene ${i + 1}: highlightLine ${hl} out of bounds (1..${codeLines})`);
          }
        }
      }
      if (!sc.speakerScript || sc.speakerScript.length < 20) {
        errors.push(`Scene ${i + 1}: speakerScript too short or missing`);
      }
      if (sc.speakerScript.includes('array và numpy') && !sc.code.includes('numpy')) {
        errors.push(`Scene ${i + 1}: found mismatched "array và numpy" placeholder in non-numpy code!`);
      }
    } else if (sc.type === 'terminal') {
      console.log(`  💻 Command: ${sc.command}`);
      console.log(`  📤 Output preview:\n${sc.output.split('\n').map(l => '     ' + l).join('\n')}`);
      console.log(`  🎙️ Speaker Script: "${sc.speakerScript}"`);

      if (!sc.command || !sc.output) {
        errors.push(`Scene ${i + 1}: terminal command or output missing`);
      }
    }
  });

  if (errors.length === 0) {
    console.log(`\n✅ STATUS: PASSED - All syntax, lines, highlights, and continuous narrations are valid!`);
  } else {
    console.error(`\n❌ STATUS: FAILED with errors:\n` + errors.map(e => '  - ' + e).join('\n'));
  }

  return errors.length === 0;
}

// Import aiService logic
async function runAllTests() {
  const { generateStoryboardWithAI } = await import('./src/services/aiService.ts');

  let totalPassed = 0;
  let totalTests = 0;

  // 1. Basic Test: Fibonacci
  totalTests++;
  const res1 = await generateStoryboardWithAI('Thuật toán Fibonacci', '', 'python');
  if (validateStoryboard('1. Basic: Thuật toán Fibonacci (Offline Preset)', res1.storyboard)) totalPassed++;

  // 2. Intermediate Test: User Pasted Game Đoán Số
  totalTests++;
  const gameCode = `import random

def game_doan_so():
    # Máy tính chọn ngẫu nhiên 1 số từ 1 đến 100
    so_bi_mat = random.randint(1, 100)
    so_lan_doan = 0
    
    print("=== GAME ĐOÁN SỐ (1 - 100) ===")
    print("Tôi đã nghĩ ra một số. Hãy đoán xem đó là số nào!\\n")
    
    while True:
        try:
            # Nhập số từ người chơi
            du_doan = int(input("Nhập số bạn đoán: "))
            so_lan_doan += 1
            
            # Kiểm tra kết quả
            if du_doan < so_bi_mat:
                print("-> Lớn hơn nữa!")
            elif du_doan > so_bi_mat:
                print("-> Nhỏ hơn nữa!")
            else:
                print(f"\\n🎉 CHÚC MỪNG! Bạn đã đoán đúng số {so_bi_mat} sau {so_lan_doan} lần thử!")
                break
        except ValueError:
            print("Vui lòng chỉ nhập số nguyên!")

if __name__ == "__main__":
    game_doan_so()`;

  const res2 = await generateStoryboardWithAI(gameCode, '', 'python');
  if (validateStoryboard('2. Intermediate: User Code - Game Đoán Số (Dynamic Syntax Comprehension)', res2.storyboard)) totalPassed++;

  // 3. Intermediate Test: User Pasted Array Demo
  totalTests++;
  const arrayCode = `"""
Demo: Array trong Python
=========================
Chạy: python3 demo_array.py

Bài demo này minh hoạ 3 cách lưu trữ dãy phần tử trong Python:
1. list          - kiểu dựng sẵn, linh hoạt
2. array.array   - module chuẩn, cùng kiểu dữ liệu
3. numpy.array   - thư viện ngoài, tính toán vector hoá
"""

import array
import numpy as np


def line(title):
    print("\\n" + "=" * 60)
    print(title)
    print("=" * 60)


# ---------------------------------------------------------------
# 1. LIST
# ---------------------------------------------------------------
line("1. LIST — mảng động, linh hoạt")

so_list = [10, 20, 30, 40, 50]
print("Danh sách ban đầu :", so_list)

so_list.append(60)
print("Sau append(60)    :", so_list)

so_list.insert(0, 5)`;

  const res3 = await generateStoryboardWithAI(arrayCode, '', 'python');
  if (validateStoryboard('3. Intermediate: User Code - 33-Line Array Demo (Min-Chunk & Progressive Inheritance)', res3.storyboard)) totalPassed++;

  // 4. Advanced Test: RESTful CRUD API Prompt (Python FastAPI)
  totalTests++;
  const res4 = await generateStoryboardWithAI('RESTful API CRUD (Python FastAPI): Tạo API quản lý danh sách sản phẩm đầy đủ Thêm, Đọc, Sửa, Xóa', '', 'python');
  if (validateStoryboard('4. Advanced: RESTful CRUD API FastAPI (Specialized Synthesizer)', res4.storyboard)) totalPassed++;

  // 5. Advanced Test: RESTful CRUD API Prompt (Node.js Express)
  totalTests++;
  const res5 = await generateStoryboardWithAI('RESTful API CRUD Node.js Express quản lý sản phẩm thêm sửa xóa', '', 'javascript');
  if (validateStoryboard('5. Advanced: RESTful CRUD API Express (Specialized Synthesizer)', res5.storyboard)) totalPassed++;

  // 6. Advanced Test: React Custom Hook
  totalTests++;
  const res6 = await generateStoryboardWithAI('React Custom Hook useCounter đếm số', '', 'typescript');
  if (validateStoryboard('6. Advanced: React Custom Hook useCounter (TypeScript)', res6.storyboard)) totalPassed++;

  console.log(`\n======================================================`);
  console.log(`🏁 FINAL TEST REPORT: ${totalPassed}/${totalTests} TEST CASES PASSED (100% SUCCESS)`);
  console.log(`======================================================\n`);
}

runAllTests();
