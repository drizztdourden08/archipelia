/* @layer core @kind logic */
import type { CatalogEntry, InstalledGame } from '@archipelia/model';
import { readRuntime } from '@archipelia/engine';
import { readCatalog } from '../read-catalog';
import { trustRoot as trustRootOf } from '../first-party/trust-root';
import { fitEntries } from '../first-party/fit-entries';
import { mergeCatalog } from '../first-party/merge-catalog';
import { readFirstParty } from '../first-party/read-first-party';
import { installFromFile } from '../install/install-from-file';
import { installOfficial } from '../install/install-official';
import type { PackagePreview } from '../install/package-preview.type';
import { previewFilePackages } from '../install/preview-file-packages';
import { previewWorldPackages } from '../install/preview-world-packages';
import { installWorld } from '../install/install-world';
import { withTempFile } from '../install/with-temp-file';
import { removeWorld } from '../install/remove-world';
import { createEnricher } from '../enrich/create-enricher';
import { createEnrichEntry } from '../enrich/create-enrich-entry';
import { officialEntries } from '../official/official-entries';
import { createSourceService } from '../source/create-source-service';
import { wheelIdsOf } from '../wheel/wheel-ids-of';
import { consentOf } from './consent-of';
import { createWorldInfo } from './create-world-info';
import { withListedGuides } from '../official/with-listed-guides';
import type { CatalogServiceDeps, CatalogView, InstallRequest, Latest } from './catalog-service.type';
import { CACHE_DIR } from './catalog-service.constants';

const createCatalogService = ({ games: files, cache, engineDir, fetch: fetchFn, trustRoot, build, buildSandbox, log }: CatalogServiceDeps) => {
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

  const official = async (): Promise<CatalogEntry[]> => withListedGuides(await officialEntries(await engineDir()), latest?.entries ?? []);

  const root = trustRoot ?? (() => trustRootOf(cache));

  const indexEntry = async (apworld: string) => {
    await read(false);
    const entry = latest?.entries.find((e) => e.apworld === apworld && e.source !== 'official');
    if (!entry || !latest) throw new Error(`${apworld} is not in the index`);
    return { entry, latest };
  };

  const install = async (request: InstallRequest): Promise<InstalledGame> => {
    const base = { engineDir: await engineDir(), files };
    if (request.kind === 'official') return installOfficial({ ...base, apworld: request.apworld });
    const consent = consentOf(request);
    if (request.kind === 'file') {
      return withTempFile(request.fileName, request.bytes, (path) => installFromFile({ ...base, path, ...consent }));
    }
    const { entry, latest: current } = await indexEntry(request.apworld);
    return installWorld({
      ...base, entry, version: request.version, trust: { clients: current.firstParty.clients, root },
      ...consent, ...(fetchFn ? { fetch: fetchFn } : {}),
    });
  };

  const packages = async (request: InstallRequest): Promise<PackagePreview> => {
    if (request.kind === 'official') return { sha256: '', packages: [] };
    if (request.kind === 'file') return withTempFile(request.fileName, request.bytes, async (path) => previewFilePackages(await engineDir(), path, wheelIdsOf(request.wheels)));
    const { entry } = await indexEntry(request.apworld);
    return previewWorldPackages({
      engineDir: await engineDir(), entry, version: request.version, wheels: wheelIdsOf(request.wheels), ...(fetchFn ? { fetch: fetchFn } : {}),
    });
  };

  const remove = async (apworld: string) => removeWorld({ engineDir: await engineDir(), files, apworld });

  const { enrich } = createEnricher({
    cache, engineDir, entryOf: createEnrichEntry(engineDir, () => latest?.entries ?? []), ...(fetchFn ? { fetch: fetchFn } : {}),
  });

  const sources = createSourceService({ engineDir, worldOf: createWorldInfo(indexEntry, enrich), run: build, sandbox: buildSandbox, log, ...(fetchFn ? { fetch: fetchFn } : {}) });

  return { enrich, install, official, packages, read, remove, sources };
};

export { createCatalogService };
