/* @layer core @kind logic */
import type { RunOverride, SessionPlayer } from '../session.type';
import { describePlayer } from './describe-player';

const keyOf = (player: SessionPlayer): string => (player.kind === 'set' ? player.name : `open seat ${player.slot}`);

const bodyOf = (player: SessionPlayer): string => (player.kind === 'set' && player.source.kind === 'yaml' ? player.source.yaml : '');

const sameSetup = (a: SessionPlayer, b: SessionPlayer): boolean => describePlayer(a) === describePlayer(b) && bodyOf(a) === bodyOf(b);

const change = (player: SessionPlayer, from: string, to: string): RunOverride =>
  ({ field: `players.${keyOf(player)}`, label: `Player ${keyOf(player)}`, from, to });

const playerOverridesOf = (saved: readonly SessionPlayer[], used: readonly SessionPlayer[]): RunOverride[] => {
  const before = new Map(saved.map((player) => [keyOf(player), player]));
  const after = new Set(used.map(keyOf));
  const kept = used.flatMap((player) => {
    const was = before.get(keyOf(player));
    if (!was) return [change(player, '', describePlayer(player))];
    return sameSetup(was, player) ? [] : [change(player, describePlayer(was), describePlayer(player))];
  });
  const removed = saved.filter((player) => !after.has(keyOf(player))).map((player) => change(player, describePlayer(player), ''));
  return [...kept, ...removed];
};

export { playerOverridesOf };
