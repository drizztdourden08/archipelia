/* @layer renderer-app @kind logic */
import { isLoose } from './is-loose';

const coerceCounts = (raw: unknown): Record<string, number> | undefined => {
  if (!isLoose(raw)) return undefined;
  const entries = Object.entries(raw).map(([key, count]) => [key, typeof count === 'string' ? Number(count) : count] as const);
  return entries.every(([, count]) => typeof count === 'number' && Number.isFinite(count))
    ? Object.fromEntries(entries) as Record<string, number>
    : undefined;
};

export { coerceCounts };
