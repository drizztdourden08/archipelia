/* @layer core @kind logic */
import type { Failure } from '@drizztdourden08/archipelia-lobby-protocol';
import { checkWorldRange } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby, WorldUpload } from '@archipelia/model';
import { readApworld } from './read-apworld';

const invalid = (message: string): Failure => ({ code: 'world-invalid', message });

const checkWorld = (lobby: Lobby, world: WorldUpload, bytes: Uint8Array | null): Failure | null => {
  const label = `The world for ${world.game}`;
  if (!bytes) return invalid(`${label} is missing.`);
  const read = readApworld(bytes);
  if (!read.ok) return invalid(`${label} ${read.problem}.`);
  const { module, manifest } = read;
  if (module !== world.module) return invalid(`${label} holds the package ${module}, not ${world.module}.`);
  if (manifest.game !== world.game) return invalid(`${label} names the game ${manifest.game ?? 'nothing'}.`);
  if (manifest.worldVersion !== undefined && manifest.worldVersion !== world.worldVersion) {
    return invalid(`${label} is version ${manifest.worldVersion}, not ${world.worldVersion}.`);
  }
  return checkWorldRange(lobby.engine.ap, { game: world.game, worldVersion: world.worldVersion, ...manifestRange(manifest) });
};

const manifestRange = ({ minimumAp, maximumAp }: { minimumAp?: string; maximumAp?: string }) => ({
  ...(minimumAp === undefined ? {} : { minimumAp }),
  ...(maximumAp === undefined ? {} : { maximumAp }),
});

export { checkWorld };
