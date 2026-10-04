/* @layer core @kind logic */
import type { CatalogEntry, InstalledGame } from '@archipelia/model';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { readCatalog } from '../read-catalog';
import type { Catalog } from '../read-catalog.type';
import { installFromFile } from '../install/install-from-file';
import { installOfficial } from '../install/install-official';
import { installWorld } from '../install/install-world';
import { removeWorld } from '../install/remove-world';
import { officialEntries } from '../official/official-entries';
import type { CatalogServiceDeps, CatalogView, InstallRequest } from './catalog-service.type';
import { CACHE_DIR } from './catalog-service.constants';

const createCatalogService = ({ files, engineDir }: CatalogServiceDeps) => {
  let latest: (Catalog & { fetchedAt: number }) | undefined;

  const read = async (refresh: boolean): Promise<CatalogView> => {
    if (!latest || refresh) latest = { ...(await readCatalog({ files, cacheDir: CACHE_DIR })), fetchedAt: Date.now() };
    return { apVersion: latest.apVersion, entries: latest.entries.filter((e) => e.source === 'index'), problems: latest.problems.length, fetchedAt: latest.fetchedAt };
  };

  const official = async (): Promise<CatalogEntry[]> => {
    const named = new Map((latest?.entries ?? []).filter((e) => e.source === 'official').map((e) => [e.apworld, e]));
    return (await officialEntries(engineDir())).map((entry) => {
      const listed = named.get(entry.apworld);
      return listed ? { ...entry, displayName: listed.displayName, home: listed.home, setupGuide: listed.setupGuide, tags: listed.tags } : entry;
    });
  };

  const installBytes = async (fileName: string, bytes: Uint8Array) => {
    const dir = await mkdtemp(join(tmpdir(), 'archipelia-apworld-'));
    try {
      const path = join(dir, assertSafeName(fileName, 'file name'));
      await writeFile(path, bytes);
      return await installFromFile({ engineDir: engineDir(), files, path });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  };

  const install = async (request: InstallRequest): Promise<InstalledGame> => {
    const base = { engineDir: engineDir(), files };
    if (request.kind === 'official') return installOfficial({ ...base, apworld: request.apworld });
    if (request.kind === 'file') return installBytes(request.fileName, request.bytes);
    await read(false);
    const entry = latest?.entries.find((e) => e.apworld === request.apworld && e.source === 'index');
    if (!entry) throw new Error(`${request.apworld} is not in the index`);
    return installWorld({ ...base, entry, version: request.version });
  };

  const remove = (apworld: string) => removeWorld({ engineDir: engineDir(), files, apworld });

  return { install, official, read, remove };
};

export { createCatalogService };
