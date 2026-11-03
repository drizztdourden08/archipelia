/* @layer core @kind logic */
import type { SessionPlayer, StoredPlayer } from './session.type';

const playerOf = (stored: StoredPlayer): SessionPlayer => {
  if (stored.kind === 'direct') return { kind: 'direct', slot: stored.slot };
  if (stored.kind === 'set') return stored;
  const { slot, name, game, source } = stored;
  if (name === undefined || game === undefined || source === undefined) return { kind: 'direct', slot };
  return { kind: 'set', slot, name, game, source };
};

export { playerOf };
