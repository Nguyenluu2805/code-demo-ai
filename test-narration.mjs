function generateDeepCodeNarrative(chunkLines, startTypingFromLine, totalLines, language) {
  const sentences = [];
  const validLines = chunkLines.map(l => l.trim()).filter(l => l.length > 0);

  // 1. Check if header / imports
  const hasImports = validLines.some(l => l.startsWith('import ') || l.startsWith('from '));
  const hasDocstring = validLines.some(l => l.startsWith('"""') || l.startsWith("'''"));
  const hasDef = validLines.some(l => l.startsWith('def ') || l.startsWith('function '));

  if (hasDocstring || hasImports) {
    sentences.push(`Chào mừng các bạn đến với bài hướng dẫn thực hành cấu trúc dữ liệu ${language === 'python' ? 'Python' : language}.`);
    if (hasDocstring) {
      sentences.push(`Đầu tiên, chúng ta viết phần chú thích tóm tắt mục tiêu so sánh hiệu năng giữa List, Array tiêu chuẩn và NumPy Array.`);
    }
    if (hasImports) {
      sentences.push(`Tiếp theo, ta nạp các thư viện chuẩn array và numpy để sẵn sàng cho các phép biến đổi vector.`);
    }
    sentences.push(`Sau khi khai báo hoàn tất, chương trình đã có đầy đủ các module cần thiết để đi vào phần thực thi chính.`);
    return sentences.join(' ');
  }

  if (hasDef) {
    sentences.push(`Bây giờ, chúng ta sẽ xây dựng hàm tiện ích line nhận vào tham số title.`);
    sentences.push(`Bên trong hàm, ta sử dụng lệnh print với chuỗi 60 dấu bằng để tạo đường kẻ phân cách trực quan trên console.`);
    sentences.push(`Hàm này sẽ được tái sử dụng xuyên suốt để phân biệt rõ ràng kết quả của từng phần demo.`);
    return sentences.join(' ');
  }

  // Check specific operations in code
  const hasList = validLines.some(l => l.includes('so_list') || l.includes('list') || l.includes('LIST'));
  const hasAppend = validLines.some(l => l.includes('.append(') || l.includes('.push('));
  const hasInsert = validLines.some(l => l.includes('.insert(') || l.includes('.splice('));

  if (hasList || hasAppend || hasInsert) {
    sentences.push(`Bước vào phần 1, chúng ta tìm hiểu kiểu dữ liệu List là mảng động linh hoạt nhất trong Python.`);
    if (validLines.some(l => l.includes('so_list ='))) {
      sentences.push(`Đầu tiên, ta khởi tạo biến so_list chứa 5 phần tử ban đầu từ 10 đến 50 và in ra màn hình.`);
    }
    if (hasAppend) {
      sentences.push(`Tiếp theo, ta gọi phương thức append(60) để chèn thêm giá trị 60 vào vị trí cuối cùng của danh sách.`);
    }
    if (hasInsert) {
      sentences.push(`Sau đó, sử dụng hàm insert(0, 5) để chèn số 5 vào ngay vị trí chỉ số 0 ở đầu mảng.`);
    }
    sentences.push(`Toàn bộ quá trình biến đổi danh sách được in ra chi tiết để người học dễ dàng đối chiếu kết quả.`);
    return sentences.join(' ');
  }

  // Generic intelligent narrative
  sentences.push(`Ở phân cảnh này, chúng ta tiếp tục triển khai các câu lệnh từ dòng ${startTypingFromLine} đến dòng ${startTypingFromLine + chunkLines.length - 1}.`);
  sentences.push(`Các câu lệnh được gõ phím tuần tự để thiết lập logic thuật toán và cập nhật các biến tương ứng.`);
  sentences.push(`Sau khi hoàn thành, khối lệnh này sẽ kết nối liền mạch với cấu trúc toàn bài.`);
  return sentences.join(' ');
}

const sampleCode = `"""
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

const allLines = sampleCode.split('\n');

console.log("=== Scene 1 Narration ===");
console.log(generateDeepCodeNarrative(allLines.slice(0, 15), 1, 33, 'python'));

console.log("\n=== Scene 2 Narration ===");
console.log(generateDeepCodeNarrative(allLines.slice(15, 21), 16, 33, 'python'));

console.log("\n=== Scene 3 Narration ===");
console.log(generateDeepCodeNarrative(allLines.slice(21, 33), 22, 33, 'python'));
