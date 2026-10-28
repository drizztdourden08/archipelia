/* @layer core @kind logic */
import { hostedPlayers } from '../hosted-players';
import type { RunPlayer } from '../session.type';
import type { RunPlayersInput } from './run-record.type';

const runPlayersOf = ({ saved, hosted, joined = [] }: RunPlayersInput): RunPlayer[] => {
  const savedNames = new Set(saved.players.map((player) => player.name));
  const joinedSlots = new Set(joined.map((player) => player.slot));
  const own: RunPlayer[] = hostedPlayers(hosted)
    .filter((player) => !joinedSlots.has(player.slot))
    .map(({ slot, name, game }) => ({ slot, name, game, origin: savedNames.has(name) ? 'saved' : 'added' }));
  const clients: RunPlayer[] = joined.map((player) => ({ ...player, origin: 'joined' }));
  return [...own, ...clients].sort((a, b) => a.slot - b.slot);
};

export { runPlayersOf };
