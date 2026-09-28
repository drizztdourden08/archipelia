/* @layer core @kind logic */
import type { InstalledGame } from '@archipelia/model';
import { readRuntime } from '@archipelia/engine';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import type { InstallFromFileParams } from './install-from-file.type';
import { readApworld } from './read-apworld';
import { commitInstall } from './commit-install';
import { hashDecision } from './hash-decision';
import { hashFile } from './hash-file';

const installFromFile = async ({ engineDir, files, path }: InstallFromFileParams): Promise<InstalledGame> => {
  const runtime = await readRuntime(engineDir);
  const info = await readApworld(path);
  const apworld = assertSafeName(info.module, 'apworld');
  return commitInstall({
    runtime, files, file: path, info, apworld, game: info.manifest.game, source: 'file', layout: 'apworld',
    hash: hashDecision(undefined, await hashFile(path), path), requires: [],
  });
};

export { installFromFile };
