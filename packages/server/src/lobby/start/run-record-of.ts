/* @layer core @kind logic */
import type { Lobby, RunPlayer } from '@archipelia/model';
import type { LobbyRun } from '@archipelia/sessions';
import type { Participant } from './start.type';

const playerOf = ({ member, slot }: Participant, index: number): RunPlayer => {
  const base = { slot: index + 1, name: slot.name, game: slot.game };
  if (member.kind === 'host') return slot.origin ? { ...base, origin: slot.origin } : base;
  return { ...base, origin: 'joined', member: { displayName: member.displayName, ...(member.client ? { client: member.client.name } : {}), trust: member.trust } };
};

const runRecordOf = (lobby: Lobby, players: Participant[]): Pick<LobbyRun, 'source' | 'players'> => ({
  ...(lobby.source ? { source: lobby.source } : {}),
  players: players.map(playerOf),
});

export { runRecordOf };
