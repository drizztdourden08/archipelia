/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import { readOriginEntry } from '../ready/read-origin-entry';
import type { ReinstallEntryParams } from './reinstall-entry.type';

const reinstallEntry = async ({ read, before, cache, apworld, request, readReleases }: ReinstallEntryParams): Promise<CatalogEntry> => {
  const listed = read.entries.find((candidate) => candidate.apworld === apworld);
  const entry = listed ?? (before?.origin ? await readOriginEntry(cache, before.origin, request, readReleases) : undefined);
  if (!entry) throw new Error(`${apworld} is no longer a first-party game in the registry or found by its topic`);
  return entry;
};

export { reinstallEntry };
