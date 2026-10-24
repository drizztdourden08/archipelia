/* @layer core @kind logic */
import type { InstalledGame } from '@archipelia/model';
import { readRuntime } from '@archipelia/engine';
import { chooseRelease } from '../first-party/choose-release';
import { vetRelease } from '../first-party/vet-release';
import type { InstallWorldParams } from './install-world.type';
import { checkSize } from './check-size';
import { downloadWorld } from './download-world';
import { hashDecision } from './hash-decision';
import { hashFile } from './hash-file';
import { readApworld } from './read-apworld';
import { commitInstall } from './commit-install';

const installWorld = async ({ engineDir, files, entry, version, fetch: request = fetch, trust }: InstallWorldParams): Promise<InstalledGame> => {
  if (entry.unavailable) throw new Error(`${entry.displayName}: ${entry.unavailable}`);
  const runtime = await readRuntime(engineDir);
  const { target, bundleUrl } = chooseRelease(entry, version, runtime.apVersion);
  const download = await downloadWorld(target.url, request);
  try {
    const what = `${entry.apworld} ${version}`;
    await checkSize(download.file, target.size, what);
    const hash = hashDecision(target.sha256, await hashFile(download.file), what);
    const info = await readApworld(download.file);
    const vetted = await vetRelease({ entry, bytes: info.bytes, bundleUrl, trust, fetch: request });
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
