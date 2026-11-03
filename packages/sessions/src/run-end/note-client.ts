/* @layer core @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import { clientEventOf } from '../live-room/client-event-of';
import type { TallyState } from './run-end.type';

const noteClient = ({ clients, seen }: TallyState, { at, text }: HostLogLine) => {
  const event = clientEventOf(text);
  if (!event) return;
  clients.set(event.name, Math.max(0, (clients.get(event.name) ?? 0) + event.delta));
  seen[event.name] = { first: seen[event.name]?.first ?? at, last: at };
};

export { noteClient };
