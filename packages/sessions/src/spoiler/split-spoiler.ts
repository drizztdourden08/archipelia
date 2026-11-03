/* @layer core @kind logic */
import { SECTION_LINE } from './spoiler.constants';
import type { SpoilerSection, SplitSpoiler } from './spoiler.type';

const isHeader = (lines: readonly string[], at: number) =>
  at > 0 && (lines[at - 1] ?? '').trim() === '' && SECTION_LINE.test(lines[at] ?? '');

const trimmed = (lines: string[]) => {
  const start = lines.findIndex((line) => line.trim() !== '');
  if (start < 0) return [];
  let end = lines.length;
  while (end > start && (lines[end - 1] ?? '').trim() === '') end -= 1;
  return lines.slice(start, end);
};

const splitSpoiler = (lines: readonly string[]): SplitSpoiler => {
  const head: string[] = [];
  const open: { title: string; lines: string[] }[] = [];
  lines.forEach((line, at) => {
    if (isHeader(lines, at)) {
      open.push({ title: line.replace(/:\s*$/, ''), lines: [] });
      return;
    }
    const current = open[open.length - 1];
    if (current) current.lines.push(line);
    else head.push(line);
  });
  const sections: SpoilerSection[] = open.map(({ title, lines: body }) => ({ title, lines: trimmed(body) }));
  return { head, sections };
};

export { splitSpoiler };
