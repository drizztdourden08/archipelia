/* @layer core @kind logic */
import type { LineKind } from './blocks-of.type';
import { HEADING, LIST_ITEM, QUOTE, REFERENCE, RULE, SETEXT, TABLE } from './blocks-of.constants';

const lineKindOf = (line: string, open: boolean): LineKind => {
  const trimmed = line.trim();
  const rules: readonly (readonly [LineKind, boolean])[] = [
    ['blank', trimmed === ''],
    ['skip', REFERENCE.test(trimmed) || TABLE.test(trimmed)],
    ['heading', HEADING.test(trimmed)],
    ['setext', open && SETEXT.test(trimmed)],
    ['rule', RULE.test(trimmed)],
    ['list', LIST_ITEM.test(trimmed)],
    ['quote', QUOTE.test(trimmed)],
    ['indented', !open && /^(?: {4}|\t)/.test(line)],
  ];
  return rules.find(([, matches]) => matches)?.[0] ?? 'text';
};

export { lineKindOf };
