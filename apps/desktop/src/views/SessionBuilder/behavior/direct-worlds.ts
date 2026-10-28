/* @layer renderer-app @kind logic */
import { joinsDirectly } from '@archipelia/model';
import type { CatalogEntry, InstalledGame, SessionPlayer } from '@archipelia/model';
import type { DirectWorld } from '../SessionBuilder.type';
import { gamesOf } from './games-of';
import { installedOf } from './installed-of';

const directWorldsOf = (players: readonly SessionPlayer[], installed: readonly InstalledGame[], entries: readonly CatalogEntry[]): DirectWorld[] =>
  gamesOf(players).flatMap((game) => {
    const apworld = installedOf(game, installed)?.apworld;
    const entry = entries.find((candidate) => (apworld === undefined ? candidate.game === game : candidate.apworld === apworld) && joinsDirectly(candidate));
    return entry ? [{ game, listed: entry.discovered === undefined }] : [];
  });

export { directWorldsOf };
