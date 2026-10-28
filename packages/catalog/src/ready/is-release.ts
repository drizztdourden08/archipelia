/* @layer core @kind logic */
import type { RegistryRelease } from '@archipelia/trust';
import type { ReadyRepo } from './ready.type';
import { sameName } from './same-name';

const isRelease = (release: RegistryRelease, repo: ReadyRepo): boolean =>
  (release.repoId === undefined ? sameName(release.repo, repo.fullName) : release.repoId === repo.id);

export { isRelease };
