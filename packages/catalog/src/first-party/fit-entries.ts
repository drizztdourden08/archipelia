/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import { buildVersion } from './build-version';
import { engineFit } from './engine-fit';
import { noBuildReason } from './no-build-reason';
import { pickBuild } from './pick-build';

const fitOne = (entry: CatalogEntry, apVersion: string): CatalogEntry => {
  const { firstParty } = entry;
  if (!firstParty) return entry;
  if (firstParty.builds) {
    const build = pickBuild(firstParty.builds, apVersion);
    if (!build) return { ...entry, unavailable: noBuildReason(entry.displayName, apVersion, firstParty.builds) };
    return { ...entry, versions: [buildVersion(firstParty, build)] };
  }
  const unavailable = engineFit(firstParty, apVersion);
  return unavailable ? { ...entry, unavailable } : entry;
};

const fitEntries = (entries: CatalogEntry[], apVersion: string | undefined): CatalogEntry[] =>
  entries.map((entry) => (apVersion === undefined || entry.unavailable ? entry : fitOne(entry, apVersion)));

export { fitEntries };
