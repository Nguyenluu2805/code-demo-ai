function extractSmartHighlightLines(chunkLines, startTypingFromLine) {
  const scoredLines = [];
  let inDocstring = false;

  chunkLines.forEach((lineText, idx) => {
    const lineNum = startTypingFromLine + idx;
    const trimmed = lineText.trim();

    if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
      inDocstring = !inDocstring;
      return;
    }
    if (inDocstring) return;

    // Ignore empty lines, pure comments
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    let score = 1;
    // Imports
    if (trimmed.startsWith('import ') || trimmed.startsWith('from ') || trimmed.startsWith('require(')) score += 4;
    // Method invocations (e.g. .append, .insert, .split)
    if (/\.[a-zA-Z_]\w*\(/.test(trimmed)) score += 5;
    // Assignments (e.g. so_list = [...])
    if (/^[a-zA-Z_]\w*\s*=\s*/.test(trimmed)) score += 4;
    // Function definition
    if (trimmed.startsWith('def ') || trimmed.startsWith('class ') || trimmed.startsWith('function ') || trimmed.startsWith('export const ')) score += 4;
    // Print / logging
    if (trimmed.startsWith('print(') || trimmed.startsWith('console.log(') || trimmed.startsWith('line(')) score += 3;
    // Control flow / return
    if (trimmed.startsWith('return ') || trimmed.startsWith('if ') || trimmed.startsWith('for ') || trimmed.startsWith('while ')) score += 4;

    scoredLines.push({ lineNum, trimmed, score });
  });

  // If no executable lines found (e.g. entire block is docstring), take the non-empty lines
  if (scoredLines.length === 0) {
    chunkLines.forEach((l, idx) => {
      if (l.trim().length > 0) scoredLines.push({ lineNum: startTypingFromLine + idx, score: 1 });
    });
  }

  scoredLines.sort((a, b) => b.score - a.score);

  const topLines = scoredLines.slice(0, 4).map(l => l.lineNum).sort((a, b) => a - b);
  // Focus on the midpoint or primary operational line
  const focusLine = topLines.length > 0 ? topLines[Math.floor(topLines.length / 2)] : startTypingFromLine;

  return { highlightLines: topLines, focusLine };
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

console.log("Scene 1 (Docstring + Imports):", extractSmartHighlightLines(allLines.slice(0, 15), 1));
console.log("Scene 2 (Helper function):", extractSmartHighlightLines(allLines.slice(15, 21), 16));
console.log("Scene 3 (List operations):", extractSmartHighlightLines(allLines.slice(21, 33), 22));
