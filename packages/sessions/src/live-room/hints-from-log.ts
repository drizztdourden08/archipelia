/* @layer core @kind logic */
import type { HintView } from './live-room.type';
import { HINT_LINE, STATE_BY_TEXT } from './log-hints.constants';
import { STATE_ORDER } from './hint-rows.constants';

const hintOf = (line: string): HintView | null => {
  const match = HINT_LINE.exec(line);
  if (!match) return null;
  const [, receiver = '', item = '', location = '', finder = '', entrance = '', state = ''] = match;
  return { key: `${finder}-${location}`, item, receiver, finder, location, entrance, state: STATE_BY_TEXT[state] ?? 'open' };
};

const hintsFromLog = (lines: readonly string[]): HintView[] => {
  const byKey = new Map<string, HintView>();
  lines.forEach((line) => {
    const hint = hintOf(line);
    if (hint) byKey.set(hint.key, hint);
  });
  return [...byKey.values()].sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state] || a.receiver.localeCompare(b.receiver));
};

export { hintsFromLog };
