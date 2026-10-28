/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import { firstPartyEntry } from '../first-party/first-party-entry';
import { withCommunityGuides } from '../first-party/with-community-guides';
import { readyEntry } from '../ready/ready-entry';
import { sameName } from '../ready/same-name';
import type { TagEntryParams } from './versions.type';

const builtOf = ({ entry, game, state, tag }: TagEntryParams): CatalogEntry | undefined => {
  if (game) return firstPartyEntry(game, state, tag);
  const found = entry.discovered;
  return found && readyEntry({
    id: found.repoId, fullName: found.repo, owner: found.owner, stars: found.stars, pushedAt: found.pushedAt, createdAt: found.createdAt, direct: found.direct,
  }, state, tag);
};

const refusal = (state: TagEntryParams['state'], tag: string): string => {
  if (state.kind === 'failed') return `The release ${tag} could not be read: ${state.message}`;
  return `The release ${tag} has no usable archipelia.json`;
};

const entryAtTag = (params: TagEntryParams): CatalogEntry => {
  const { entry, state, tag } = params;
  if (state.kind !== 'found' && state.kind !== 'builds') throw new Error(refusal(state, tag));
  const built = builtOf(params);
  if (!built || !sameName(built.apworld, entry.apworld) || (entry.discovered && built.game !== entry.game)) {
    throw new Error(`The release ${tag} lists another world than ${entry.displayName}`);
  }
  return {
    ...withCommunityGuides(built, entry),
    stability: entry.stability,
    ...(entry.requires ? { requires: entry.requires } : {}),
    ...(entry.discovered ? { discovered: entry.discovered } : {}),
  };
};

export { entryAtTag };
