import { Storyboard } from '../types';

export const PRESET_TEMPLATES: Record<string, Storyboard> = {
  'quicksort-python': {
    title: 'Giải thuật QuickSort bằng Python',
    description: 'Video demo lập trình thuật toán sắp xếp nhanh (QuickSort) tối ưu với pivot ngẫu nhiên',
    aspectRatio: '16:9',
    theme: 'one-dark',
    fps: 30,
    scenes: [
      {
        id: 'scene-1',
        type: 'editor',
        title: 'Khởi tạo hàm QuickSort và trường hợp cơ sở',
        filename: 'quicksort.py',
        language: 'python',
        code: `def quicksort(arr):\n    # Trường hợp cơ sở: Mảng có 0 hoặc 1 phần tử đã được sắp xếp\n    if len(arr) <= 1:\n        return arr`,
        startTypingFromLine: 1,
        highlightLines: [1, 3, 4],
        zoomScale: 1.1,
        focusLine: 3,
        speakerScript:
          'Xin chào các bạn! Hôm nay chúng ta sẽ cùng nhau cài đặt thuật toán QuickSort kinh điển trong Python. Đầu tiên, chúng ta khai báo hàm và xử lý trường hợp cơ sở: nếu mảng có độ dài bé hơn hoặc bằng 1, ta trả về chính mảng đó ngay lập tức.',
        durationInFrames: 330
      },
      {
        id: 'scene-2',
        type: 'editor',
        title: 'Chọn phần tử chốt (Pivot) và phân vùng mảng',
        filename: 'quicksort.py',
        language: 'python',
        code: `def quicksort(arr):\n    # Trường hợp cơ sở: Mảng có 0 hoặc 1 phần tử đã được sắp xếp\n    if len(arr) <= 1:\n        return arr\n\n    # Chọn phần tử ở giữa làm pivot để tránh trường hợp xấu nhất\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]`,
        startTypingFromLine: 6,
        highlightLines: [7, 8, 9, 10],
        zoomScale: 1.15,
        focusLine: 8,
        speakerScript:
          'Tiếp theo là bước quan trọng nhất: phân vùng dữ liệu. Ta chọn phần tử ở giữa mảng làm pivot, sau đó sử dụng list comprehension để tách mảng thành ba nhóm: nhóm nhỏ hơn pivot, nhóm bằng pivot và nhóm lớn hơn pivot một cách cực kỳ thanh lịch.',
        durationInFrames: 360
      },
      {
        id: 'scene-3',
        type: 'editor',
        title: 'Đệ quy và kết hợp mảng kết quả',
        filename: 'quicksort.py',
        language: 'python',
        code: `def quicksort(arr):\n    # Trường hợp cơ sở: Mảng có 0 hoặc 1 phần tử đã được sắp xếp\n    if len(arr) <= 1:\n        return arr\n\n    # Chọn phần tử ở giữa làm pivot để tránh trường hợp xấu nhất\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n\n    # Đệ quy sắp xếp hai nửa và ghép lại\n    return quicksort(left) + middle + quicksort(right)\n\n# Kiểm thử\nnumbers = [38, 27, 43, 3, 9, 82, 10]\nprint("Mảng ban đầu:", numbers)\nprint("Mảng sau khi sắp xếp:", quicksort(numbers))`,
        startTypingFromLine: 12,
        highlightLines: [13, 16, 17, 18],
        zoomScale: 1.12,
        focusLine: 13,
        speakerScript:
          'Cuối cùng, chúng ta gọi đệ quy quicksort trên hai mảng left và right, rồi ghép chúng với mảng middle để tạo thành mảng đã sắp xếp hoàn chỉnh với độ phức tạp trung bình O(N log N).',
        durationInFrames: 360
      },
      {
        id: 'scene-4',
        type: 'terminal',
        title: 'Chạy thử nghiệm thuật toán trên Terminal',
        command: 'python quicksort.py',
        output: `Mảng ban đầu: [38, 27, 43, 3, 9, 82, 10]\nMảng sau khi sắp xếp: [3, 9, 10, 27, 38, 43, 82]\n[SUCCESS] Thuật toán hoàn thành trong 0.0004s!`,
        speakerScript:
          'Bây giờ, hãy mở terminal và chạy lệnh python quicksort.py. Kết quả in ra chính xác hoàn hảo, mảng đã được sắp xếp tăng dần một cách mượt mà và tối ưu.',
        durationInFrames: 270
      }
    ]
  }
};
