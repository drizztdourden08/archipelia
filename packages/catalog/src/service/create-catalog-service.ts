/* @layer core @kind logic */
import type { CatalogEntry, InstalledGame } from '@archipelia/model';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readRuntime } from '@archipelia/engine';
import { loadTrustedRoot } from '@archipelia/trust';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { readCatalog } from '../read-catalog';
import { fitEntries } from '../first-party/fit-entries';
import { mergeCatalog } from '../first-party/merge-catalog';
import { readFirstParty } from '../first-party/read-first-party';
import { installFromFile } from '../install/install-from-file';
import { installOfficial } from '../install/install-official';
import { installWorld } from '../install/install-world';
import { removeWorld } from '../install/remove-world';
import { officialEntries } from '../official/official-entries';
import type { CatalogServiceDeps, CatalogView, InstallRequest, Latest } from './catalog-service.type';
import { CACHE_DIR } from './catalog-service.constants';

const createCatalogService = ({ games: files, cache, engineDir, fetch: fetchFn, trustRoot }: CatalogServiceDeps) => {
  let latest: Latest | undefined;
  let pending: Promise<Latest> | undefined;

  const fetchOnce = (force: boolean) => {
    pending ??= Promise.all([
      readCatalog({ files: cache, cacheDir: CACHE_DIR }),
      readFirstParty({ files: cache, ...(fetchFn ? { fetch: fetchFn } : {}) }, { force }),
    ])
      .then(([catalog, firstParty]) => ({
        ...catalog,
        entries: mergeCatalog(catalog.entries, firstParty.entries),
        problems: [...catalog.problems, ...firstParty.problems.map((message) => ({ path: 'registry', message }))],
        firstParty,
        fetchedAt: Date.now(),
      }))
      .finally(() => { pending = undefined; });
    return pending;
  };

  const activeAp = async () => readRuntime(await engineDir()).then((runtime) => runtime.apVersion, () => undefined);

  const read = async (refresh: boolean): Promise<CatalogView> => {
    if (!latest || refresh || pending) latest = await fetchOnce(refresh);
    const entries = fitEntries(latest.entries.filter((e) => e.source !== 'official'), await activeAp());
    return { apVersion: latest.apVersion, entries, problems: latest.problems.length, fetchedAt: latest.fetchedAt };
  };

  const official = async (): Promise<CatalogEntry[]> => {
    const named = new Map((latest?.entries ?? []).filter((e) => e.source === 'official').map((e) => [e.apworld, e]));
    return (await officialEntries(await engineDir())).map((entry) => {
      const listed = named.get(entry.apworld);
      return listed ? { ...entry, displayName: listed.displayName, home: listed.home, setupGuide: listed.setupGuide, tags: listed.tags } : entry;
    });
  };

  const installBytes = async (fileName: string, bytes: Uint8Array) => {
    const dir = await mkdtemp(join(tmpdir(), 'archipelia-apworld-'));
    try {
      const path = join(dir, assertSafeName(fileName, 'file name'));
      await writeFile(path, bytes);
      return await installFromFile({ engineDir: await engineDir(), files, path });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  };

  const root = trustRoot ?? (async () => (await loadTrustedRoot({ files: cache })).root);

  const install = async (request: InstallRequest): Promise<InstalledGame> => {
    const base = { engineDir: await engineDir(), files };
    if (request.kind === 'official') return installOfficial({ ...base, apworld: request.apworld });
    if (request.kind === 'file') return installBytes(request.fileName, request.bytes);
    await read(false);
    const entry = latest?.entries.find((e) => e.apworld === request.apworld && e.source !== 'official');
    if (!entry || !latest) throw new Error(`${request.apworld} is not in the index`);
    return installWorld({
      ...base, entry, version: request.version, trust: { clients: latest.firstParty.clients, root },
      ...(fetchFn ? { fetch: fetchFn } : {}),
    });
  };

  const remove = async (apworld: string) => removeWorld({ engineDir: await engineDir(), files, apworld });

  return { install, official, read, remove };
};

export { createCatalogService };
