/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';

const releaseVersion = (entry: CatalogEntry): string | undefined => entry.firstParty?.worldVersion ?? entry.versions[0]?.version;

export { releaseVersion };
