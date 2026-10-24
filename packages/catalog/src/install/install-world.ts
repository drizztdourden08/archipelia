/* @layer core @kind logic */
import type { InstalledGame } from '@archipelia/model';
import { readRuntime } from '@archipelia/engine';
import { assertReleaseFits } from '../first-party/assert-release-fits';
import { vetRelease } from '../first-party/vet-release';
import type { InstallWorldParams } from './install-world.type';
import { downloadWorld } from './download-world';
import { hashDecision } from './hash-decision';
import { hashFile } from './hash-file';
import { readApworld } from './read-apworld';
import { commitInstall } from './commit-install';

const installWorld = async ({ engineDir, files, entry, version, fetch: request = fetch, trust }: InstallWorldParams): Promise<InstalledGame> => {
  if (entry.unavailable) throw new Error(`${entry.displayName}: ${entry.unavailable}`);
  const target = entry.versions.find((v) => v.version === version);
  if (!target) throw new Error(`${entry.apworld} has no version ${version}`);
  const runtime = await readRuntime(engineDir);
  assertReleaseFits(entry, runtime.apVersion);
  const download = await downloadWorld(target.url, request);
  try {
    const hash = hashDecision(target.sha256, await hashFile(download.file), `${entry.apworld} ${version}`);
    const info = await readApworld(download.file);
    const vetted = await vetRelease({ entry, bytes: info.bytes, trust, fetch: request });
    return await commitInstall({
      runtime, files, file: download.file, info, apworld: entry.apworld, game: entry.game, version,
      source: entry.firstParty ? 'first-party' : 'index', layout: 'apworld', hash, requires: entry.requires ?? [],
      ...(vetted ? { trust: vetted } : {}),
    });
  } finally {
    await download.dispose();
  }
};

export { installWorld };
