/* @layer core @kind logic */
import { readRuntime } from '@archipelia/engine';
import { readFirstParty } from '../first-party/read-first-party';
import { trustRoot as trustRootOf } from '../first-party/trust-root';
import { createVersions } from '../versions/create-versions';
import { installWorld } from './install-world';
import { readInstalled } from './read-installed';
import { reinstallChoice } from './reinstall-choice';
import { reinstallEntry } from './reinstall-entry';
import type { Reinstalled, ReinstallFirstPartyParams } from './reinstall-first-party.type';

const reinstallFirstParty = async ({ engineDir, files, cache, apworld, fetch: fetchFn, trustRoot }: ReinstallFirstPartyParams): Promise<Reinstalled> => {
  const read = await readFirstParty({ files: cache, ...(fetchFn ? { fetch: fetchFn } : {}) });
  const before = await readInstalled(files, apworld);
  const entry = await reinstallEntry({ read, before, cache, apworld, request: fetchFn ?? fetch });
  const versions = createVersions({ files: cache, ...(fetchFn ? { fetch: fetchFn } : {}) });
  const { note, ...chosen } = await reinstallChoice(versions, { entry, registry: read.registry, ap: (await readRuntime(engineDir)).apVersion, before });
  const game = await installWorld({
    engineDir, files, ...chosen, ...(before ? { packages: { sha256: before.sha256, packages: before.packages ?? [] } } : {}), trust: { clients: read.clients, root: trustRoot ?? (() => trustRootOf(cache)) },
    ...(fetchFn ? { fetch: fetchFn } : {}),
  });
  return { game, ...(note ? { note } : {}) };
};

export { reinstallFirstParty };
