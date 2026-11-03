/* @layer core @kind logic */
import { clientEventOf } from './client-event-of';

const onlineFromLog = (lines: readonly string[]): Record<string, boolean> => {
  const clients = new Map<string, number>();
  lines.forEach((line) => {
    const event = clientEventOf(line);
    if (event) clients.set(event.name, Math.max(0, (clients.get(event.name) ?? 0) + event.delta));
  });
  return Object.fromEntries([...clients].map(([name, count]) => [name, count > 0]));
};

export { onlineFromLog };
