/* @layer core @kind logic */
import { fitEntries } from '../first-party/fit-entries';
import { releaseVersion } from '../first-party/release-version';
import { entryAtTag } from './entry-at-tag';
import type { ReleaseListDeps } from './list-release-versions.type';
import { readTagState } from './read-tag-state';
import { registryGameOf } from './registry-game-of';
import type { Pinned, PinnedParams } from './versions.type';

const pinRelease = async ({ request, readReleases }: ReleaseListDeps, { entry, registry, ap, tag }: PinnedParams): Promise<Pinned> => {
  const repo = entry.firstParty?.repo;
  if (!repo) throw new Error(`${entry.displayName} has no releases to choose from`);
  const release = (await readReleases(repo)).releases.find((candidate) => candidate.tag === tag);
  if (!release) throw new Error(`${tag} is not a release of ${repo}`);
  const game = registryGameOf(registry, entry);
  const tagged = entryAtTag({ entry, game, state: await readTagState(request, repo, game, tag), tag });
  const fitted = fitEntries([tagged], ap)[0] ?? tagged;
  const version = releaseVersion(fitted);
  if (fitted.unavailable || !version) throw new Error(`${entry.displayName} ${tag}: ${fitted.unavailable ?? 'it names no version'}`);
  return { entry: fitted, version, release: { tag, prerelease: release.prerelease } };
};

export { pinRelease };
