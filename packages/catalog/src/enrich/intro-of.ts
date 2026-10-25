/* @layer core @kind logic */
import type { Intro, TextBlock } from './enrich.type';
import { clampText } from './clamp-text';
import { DETAILS_MAX, MIN_INTRO, SKIP_HEADING, SUMMARY_MAX } from './enrich.constants';

const isIntro = ({ heading, text, prose }: TextBlock) => prose && text.length >= MIN_INTRO && /[A-Za-z]{3}/.test(text) && !SKIP_HEADING.test(heading);

const detailsOf = (blocks: TextBlock[]): string => {
  const parts: string[] = [];
  let heading = '';
  for (const block of blocks.filter(({ heading: title }) => !SKIP_HEADING.test(title))) {
    if (block.heading !== heading && block.heading !== '') parts.push(block.heading);
    heading = block.heading;
    parts.push(block.text);
  }
  return clampText(parts.join('\n\n'), DETAILS_MAX);
};

const introOf = (blocks: TextBlock[]): Intro => {
  const first = blocks.find(isIntro);
  if (!first) return {};
  const details = detailsOf(blocks);
  return { summary: clampText(first.text, SUMMARY_MAX), ...(details.length > first.text.length ? { details } : {}) };
};

export { introOf };
