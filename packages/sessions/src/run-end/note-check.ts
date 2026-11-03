/* @layer core @kind logic */
import { checkOf } from '../live-room/log-checks';
import type { TallyState } from './run-end.type';

const noteCheck = ({ entries, names }: TallyState, text: string) => {
  const check = checkOf(text, names);
  if (!check) return;
  const known = entries.get(check.sender) ?? new Set<string>();
  known.add(check.entry);
  entries.set(check.sender, known);
};

export { noteCheck };
