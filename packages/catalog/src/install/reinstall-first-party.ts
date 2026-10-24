/* @layer core @kind logic */
import type { InstalledGame } from '@archipelia/model';
import { readFirstParty } from '../first-party/read-first-party';
import { releaseVersion } from '../first-party/release-version';
import { trustRoot as trustRootOf } from '../first-party/trust-root';
import { installWorld } from './install-world';
import type { ReinstallFirstPartyParams } from './reinstall-first-party.type';

const reinstallFirstParty = async ({ engineDir, files, cache, apworld, fetch: fetchFn, trustRoot }: ReinstallFirstPartyParams): Promise<InstalledGame> => {
  const read = await readFirstParty({ files: cache, ...(fetchFn ? { fetch: fetchFn } : {}) });
  const entry = read.entries.find((candidate) => candidate.apworld === apworld);
  const version = entry && releaseVersion(entry);
  if (!entry) throw new Error(`${apworld} is no longer a first-party game in the registry`);
  return installWorld({
    engineDir, files, entry, version: version ?? '', trust: { clients: read.clients, root: trustRoot ?? (() => trustRootOf(cache)) },
    ...(fetchFn ? { fetch: fetchFn } : {}),
  });
};

export { reinstallFirstParty };
