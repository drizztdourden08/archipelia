/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { engineTags } from '@archipelia/engine';
import type { GithubRepo } from '../enrich/enrich.type';
import type { GithubClient } from '../source/source.type';
import { pickWheel } from './pick-wheel';
import { releasesOf } from './releases-of';
import type { Offer } from './wheel-offer.type';
import { MAX_RELEASES } from './wheel.constants';

const wheelOffer = async (client: GithubClient, repo: GithubRepo, names: readonly string[], runtime: EngineRuntime): Promise<Offer> => {
  try {
    const releases = releasesOf(await client.api(`/repos/${repo.owner}/${repo.repo}/releases?per_page=${MAX_RELEASES}`));
    if (!releases.some((release) => release.assets.length > 0)) return { state: 'none' };
    const pick = pickWheel(releases, await engineTags(runtime), names);
    return pick ? { state: 'found', wheel: pick } : { state: 'none' };
  } catch {
    return { state: 'unknown' };
  }
};

export { wheelOffer };
