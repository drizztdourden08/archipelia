/* @layer core @kind logic */
import { mergeCatalog } from '../first-party/merge-catalog';
import type { FirstPartyRead } from '../first-party/first-party.type';
import type { ReadyRead } from '../ready/create-ready.type';
import { resolveReady } from '../ready/resolve-ready';
import type { Catalog } from '../read-catalog.type';
import type { Latest } from './catalog-service.type';

const problemsOf = (path: string, messages: string[]) => messages.map((message) => ({ path, message }));

const assembleLatest = (catalog: Catalog, firstParty: FirstPartyRead, ready: ReadyRead, at: number): Latest => {
  const resolved = resolveReady(mergeCatalog(catalog.entries, firstParty.entries), firstParty.registry, ready.candidates);
  const { search } = ready;
  const limit = search.limitedUntil === undefined ? undefined : { listedAt: search.fetchedAt || at, limitedUntil: search.limitedUntil };
  const limited = catalog.limited ?? limit;
  return {
    ...catalog,
    entries: resolved.entries,
    problems: [
      ...catalog.problems,
      ...problemsOf('registry', firstParty.problems),
      ...problemsOf('ready', [...search.problems, ...resolved.problems]),
    ],
    firstParty,
    ready: search,
    fetchedAt: at,
    ...(limited ? { limited } : {}),
  };
};

export { assembleLatest };
