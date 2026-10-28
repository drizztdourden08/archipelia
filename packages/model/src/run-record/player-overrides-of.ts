/* @layer core @kind logic */
import type { RunOverride, SessionPlayer } from '../session.type';
import { describePlayer } from './describe-player';

const bodyOf = ({ source }: SessionPlayer): string => (source?.kind === 'yaml' ? source.yaml : '');

const sameSetup = (a: SessionPlayer, b: SessionPlayer): boolean => describePlayer(a) === describePlayer(b) && bodyOf(a) === bodyOf(b);

const change = (player: SessionPlayer, from: string, to: string): RunOverride =>
  ({ field: `players.${player.name}`, label: `Player ${player.name}`, from, to });

const playerOverridesOf = (saved: readonly SessionPlayer[], used: readonly SessionPlayer[]): RunOverride[] => {
  const before = new Map(saved.map((player) => [player.name, player]));
  const after = new Set(used.map((player) => player.name));
  const kept = used.flatMap((player) => {
    const was = before.get(player.name);
    if (!was) return [change(player, '', describePlayer(player))];
    return sameSetup(was, player) ? [] : [change(player, describePlayer(was), describePlayer(player))];
  });
  const removed = saved.filter((player) => !after.has(player.name)).map((player) => change(player, describePlayer(player), ''));
  return [...kept, ...removed];
};

export { playerOverridesOf };
