/* @layer renderer-app @kind logic */
import type { SpoilerItemTypes, SpoilerLog } from '@archipelia/sessions/spoiler';
import type { SpoilerEntry } from '../SpoilerWidget.type';
import { entryOf } from './entry-of';

const entriesOf = (log: SpoilerLog, types: SpoilerItemTypes | null): SpoilerEntry[] => {
  const games = new Map(log.players.map((player) => [player.name, player.game]));
  return log.placements.map((placement) => entryOf(placement, types, games));
};

export { entriesOf };
