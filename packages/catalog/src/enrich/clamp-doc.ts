/* @layer core @kind logic */

const clampDoc = (text: string, max: number): string => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const half = max / 2;
  const [paragraph, line] = [cut.lastIndexOf('\n\n'), cut.lastIndexOf('\n')];
  const at = [paragraph, line].find((found) => found >= half) ?? max;
  return cut.slice(0, at).trimEnd();
};

export { clampDoc };
