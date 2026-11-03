/* @layer core @kind logic */
import { ENTRANCE_LINE } from './spoiler.constants';
import type { EntranceDirection, SpoilerEntrance } from './spoiler.type';

const playerPrefixOf = (line: string, names: readonly string[]) =>
  [...names].sort((a, b) => b.length - a.length).find((name) => line.startsWith(`${name}: `)) ?? null;

const parseEntrances = (lines: readonly string[], names: readonly string[]): SpoilerEntrance[] =>
  lines.flatMap((line) => {
    const player = playerPrefixOf(line, names);
    const body = player === null ? line : line.slice(player.length + 2);
    const match = ENTRANCE_LINE.exec(body.trim());
    if (!match) return [];
    return [{ player, entrance: match[1] ?? '', exit: match[3] ?? '', direction: (match[2] ?? '=>') as EntranceDirection }];
  });

export { parseEntrances };
