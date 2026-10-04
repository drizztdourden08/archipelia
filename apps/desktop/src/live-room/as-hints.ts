/* @layer renderer-app @kind logic */
import type { ProtocolHint } from './live-room.type';

const isHint = (value: unknown): value is ProtocolHint => {
  if (typeof value !== 'object' || value === null) return false;
  const hint = value as Record<string, unknown>;
  return ['receiving_player', 'finding_player', 'location', 'item'].every((field) => typeof hint[field] === 'number');
};

const asHints = (value: unknown): ProtocolHint[] => (Array.isArray(value) ? value.filter(isHint) : []);

export { asHints };
