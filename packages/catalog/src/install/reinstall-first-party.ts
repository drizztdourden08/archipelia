/* @layer core @kind logic */
import type { InstalledGame } from '@archipelia/model';
import { readFirstParty } from '../first-party/read-first-party';
import { releaseVersion } from '../first-party/release-version';
import { trustRoot as trustRootOf } from '../first-party/trust-root';
import { installWorld } from './install-world';
import { readInstalled } from './read-installed';
import { reinstallEntry } from './reinstall-entry';
import type { ReinstallFirstPartyParams } from './reinstall-first-party.type';

const reinstallFirstParty = async ({ engineDir, files, cache, apworld, fetch: fetchFn, trustRoot }: ReinstallFirstPartyParams): Promise<InstalledGame> => {
  const read = await readFirstParty({ files: cache, ...(fetchFn ? { fetch: fetchFn } : {}) });
  const before = await readInstalled(files, apworld);
  const entry = await reinstallEntry({ read, before, cache, apworld, request: fetchFn ?? fetch });
  return installWorld({
    engineDir, files, entry, version: releaseVersion(entry) ?? '', ...(before ? { packages: { sha256: before.sha256, packages: before.packages ?? [] } } : {}), trust: { clients: read.clients, root: trustRoot ?? (() => trustRootOf(cache)) },
    ...(fetchFn ? { fetch: fetchFn } : {}),
  });
};

export { reinstallFirstParty };
