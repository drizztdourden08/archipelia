/* @layer core @kind logic */
import type { SourceWheelRequest } from '@archipelia/model';
import type { GithubClient } from '../source/source.type';
import type { AssetFact } from './wheel.type';
import { releasesOf } from './releases-of';
import { MAX_RELEASES } from './wheel.constants';

const findAsset = async (client: GithubClient, { owner, repo, tag, asset }: SourceWheelRequest): Promise<AssetFact> => {
  const releases = releasesOf(await client.api(`/repos/${owner}/${repo}/releases?per_page=${MAX_RELEASES}`));
  const found = releases.find((release) => release.tag === tag)?.assets.find((entry) => entry.name === asset);
  if (!found) throw new Error(`${owner}/${repo} has no release file ${asset} for ${tag}.`);
  return found;
};

export { findAsset };
