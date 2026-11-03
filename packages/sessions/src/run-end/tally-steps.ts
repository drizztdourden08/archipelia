/* @layer core @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import { clientEventOf } from '../live-room/client-event-of';
import { checkOf } from '../live-room/log-checks';
import { NOTICE } from '../live-room/online-from-log.constants';
import { GOAL_REACHED } from './run-end.constants';
import type { TallyState } from './run-end.type';

const noteCheck = ({ entries, names }: TallyState, text: string) => {
  const check = checkOf(text, names);
  if (!check) return;
  const known = entries.get(check.sender) ?? new Set<string>();
  known.add(check.entry);
  entries.set(check.sender, known);
};

const noteClient = ({ clients, seen }: TallyState, { at, text }: HostLogLine) => {
  const event = clientEventOf(text);
  if (!event) return;
  clients.set(event.name, Math.max(0, (clients.get(event.name) ?? 0) + event.delta));
  seen[event.name] = { first: seen[event.name]?.first ?? at, last: at };
};

const noteGoal = ({ goals }: TallyState, { at, text }: HostLogLine) => {
  const [, who] = GOAL_REACHED.exec(text) ?? [];
  const name = who?.replace(NOTICE, '').trim();
  if (name && !(name in goals)) goals[name] = at;
};

export { noteCheck, noteClient, noteGoal };
