/* @layer electron-main @kind logic */
import { basename } from 'node:path';
import { sha256Hex } from '@drizztdourden08/archipelia-lobby-protocol/node';
import type { InstalledGame } from '@archipelia/model';
import { APWORLD_EXTENSION } from './joins.constants';
import type { JoinWorld, RecordDeps } from './joins.type';
import { worldVersionOf } from './world-version-of';

const worldOf = async (game: InstalledGame, deps: RecordDeps): Promise<JoinWorld | undefined> => {
  if (game.layout !== 'apworld') return undefined;
  const path = await deps.worldPath(game);
  const bytes = await deps.readWorld(path);
  const module = basename(path, APWORLD_EXTENSION);
  return { module, worldVersion: worldVersionOf(bytes, module, game.schema.worldVersion), sha256: sha256Hex(bytes), size: bytes.length, path };
};

export { worldOf };
