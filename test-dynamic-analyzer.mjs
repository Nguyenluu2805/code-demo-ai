function analyzeCodeAndBuildNarrative(chunkLines, startTypingFromLine, totalLines, language) {
  const sentences = [];
  const validLines = chunkLines.map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'));

  // 1. Detect Imports
  const importLines = validLines.filter(l => l.startsWith('import ') || l.startsWith('from '));
  if (importLines.length > 0) {
    const modules = importLines.map(l => l.replace(/^(import|from)\s+([a-zA-Z0-9_]+).*/, '$2')).join(', ');
    sentences.push(`Đầu tiên, chúng ta nạp module ${modules} để phục vụ các xử lý cần thiết trong chương trình.`);
  }

  // 2. Detect Function / Class definitions
  const defLines = validLines.filter(l => l.startsWith('def ') || l.startsWith('class ') || l.startsWith('function '));
  if (defLines.length > 0) {
    const names = defLines.map(l => l.replace(/^(def|class|function)\s+([a-zA-Z0-9_]+).*/, '$2')).join(', ');
    sentences.push(`Tiếp theo, chúng ta định nghĩa cấu trúc chính với ${defLines[0].startsWith('class') ? 'lớp' : 'hàm'} ${names}.`);
  }

  // 3. Detect Variables & Random/Math operations
  const assignLines = validLines.filter(l => /^[a-zA-Z0-9_]+\s*=/.test(l));
  if (assignLines.some(l => l.includes('random.randint') || l.includes('Math.random'))) {
    sentences.push(`Máy tính sử dụng hàm random để chọn ngẫu nhiên một số bí mật trong khoảng từ 1 đến 100 và khởi tạo bộ đếm số lần đoán.`);
  } else if (assignLines.length > 0 && !defLines.length) {
    const varNames = assignLines.slice(0, 2).map(l => l.split('=')[0].trim()).join(', ');
    sentences.push(`Khởi tạo các biến lưu trữ dữ liệu gồm ${varNames} để quản lý trạng thái chương trình.`);
  }

  // 4. Detect Loops & User Inputs
  if (validLines.some(l => l.startsWith('while ') || l.startsWith('for '))) {
    sentences.push(`Sử dụng vòng lặp để duy trì tương tác liên tục với người dùng cho đến khi đạt điều kiện dừng.`);
  }
  if (validLines.some(l => l.includes('input(') || l.includes('prompt(') || l.includes('readline'))) {
    sentences.push(`Tại mỗi lượt, chương trình nhận dữ liệu dự đoán từ bàn phím và ép kiểu sang số nguyên.`);
  }

  // 5. Detect Try/Except error handling
  if (validLines.some(l => l.startsWith('try:') || l.startsWith('except '))) {
    sentences.push(`Bọc khối xử lý trong try/except để bắt lỗi ValueError, đảm bảo chương trình không bị dừng đột ngột khi người chơi nhập sai kiểu.`);
  }

  // 6. Detect Conditional branching & Win condition
  if (validLines.some(l => l.startsWith('if ') || l.startsWith('elif ') || l.startsWith('else:'))) {
    if (validLines.some(l => l.includes('CHÚC MỪNG') || l.includes('break') || l.includes('thắng'))) {
      sentences.push(`So sánh số người chơi đoán với số bí mật để đưa ra gợi ý lớn hơn hay nhỏ hơn, đồng thời in thông báo chúc mừng khi đoán trúng và kết thúc lượt chơi.`);
    } else {
      sentences.push(`Thực hiện kiểm tra các điều kiện rẽ nhánh để điều hướng luồng xử lý chính xác.`);
    }
  }

  // Fallback if empty
  if (sentences.length === 0) {
    sentences.push(`Ở phân cảnh này, chúng ta tiếp tục triển khai các câu lệnh từ dòng ${startTypingFromLine} đến dòng ${startTypingFromLine + chunkLines.length - 1}.`);
    sentences.push(`Mã nguồn được hoàn thiện tuần tự giúp liên kết toàn bộ logic ứng dụng.`);
  }

  return sentences.join(' ');
}

const sampleGame = `import random

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

const lines = sampleGame.split('\n');
console.log("=== Scene 1 (Setup & Random) ===");
console.log(analyzeCodeAndBuildNarrative(lines.slice(0, 10), 1, lines.length, 'python'));

console.log("\n=== Scene 2 (Game Loop & Input & Logic) ===");
console.log(analyzeCodeAndBuildNarrative(lines.slice(10, 28), 11, lines.length, 'python'));
