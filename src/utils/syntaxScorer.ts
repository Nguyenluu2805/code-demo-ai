/**
 * Analyze code lines to automatically select optimal highlight and focus lines
 */
export function computeSmartHighlights(
  chunkLines: string[],
  startTypingFromLine: number
): { highlightLines: number[]; focusLine: number } {
  const scoredLines: { lineNum: number; score: number }[] = [];

  chunkLines.forEach((line, idx) => {
    const lineNum = startTypingFromLine + idx;
    const trimmed = line.trim();
    if (trimmed.length === 0) return;

    let score = 0;
    // Imports
    if (trimmed.startsWith('import ') || trimmed.startsWith('from ') || trimmed.startsWith('require(')) score += 4;
    // Method invocations (e.g. .append, .insert, .split)
    if (/\.[a-zA-Z_]\w*\(/.test(trimmed)) score += 5;
    // Assignments (e.g. so_list = [...])
    if (/^[a-zA-Z_]\w*\s*=\s*/.test(trimmed)) score += 4;
    // Function / Class definition
    if (trimmed.startsWith('def ') || trimmed.startsWith('class ') || trimmed.startsWith('function ') || trimmed.startsWith('export const ')) score += 4;
    // Print / logging
    if (trimmed.startsWith('print(') || trimmed.startsWith('console.log(') || trimmed.startsWith('line(')) score += 3;
    // Control flow / return
    if (trimmed.startsWith('return ') || trimmed.startsWith('if ') || trimmed.startsWith('for ') || trimmed.startsWith('while ')) score += 4;

    scoredLines.push({ lineNum, score });
  });

  if (scoredLines.length === 0) {
    chunkLines.forEach((l, idx) => {
      if (l.trim().length > 0) scoredLines.push({ lineNum: startTypingFromLine + idx, score: 1 });
    });
  }

  scoredLines.sort((a, b) => b.score - a.score);

  const topLines = scoredLines.slice(0, 4).map((l) => l.lineNum).sort((a, b) => a - b);
  const focusLine = topLines.length > 0 ? topLines[Math.floor(topLines.length / 2)] : startTypingFromLine;

  return { highlightLines: topLines, focusLine };
}
