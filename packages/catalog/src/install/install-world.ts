/* @layer core @kind logic */
import type { InstalledGame } from '@archipelia/model';
import { readRuntime } from '@archipelia/engine';
import type { InstallWorldParams } from './install-world.type';
import { downloadWorld } from './download-world';
import { hashDecision } from './hash-decision';
import { hashFile } from './hash-file';
import { readApworld } from './read-apworld';
import { commitInstall } from './commit-install';

const installWorld = async ({ engineDir, files, entry, version, fetch }: InstallWorldParams): Promise<InstalledGame> => {
  const target = entry.versions.find((v) => v.version === version);
  if (!target) throw new Error(`${entry.apworld} has no version ${version}`);
  const runtime = await readRuntime(engineDir);
  const download = await downloadWorld(target.url, fetch);
  try {
    const hash = hashDecision(target.sha256, await hashFile(download.file), `${entry.apworld} ${version}`);
    const info = await readApworld(download.file);
    return await commitInstall({
      runtime, files, file: download.file, info, apworld: entry.apworld, game: entry.game, version,
      source: 'index', layout: 'apworld', hash, requires: entry.requires ?? [],
    });
  } finally {
    await download.dispose();
  }
};

export { installWorld };
