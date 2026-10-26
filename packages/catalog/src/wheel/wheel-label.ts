/* @layer core @kind logic */
import type { PackageSource } from '@archipelia/model';

const wheelLabel = ({ name, version, tag, repo, built, commit }: PackageSource): string =>
  (built === true ? `${name} ${version} (built from ${repo} at ${(commit ?? tag).slice(0, 7)})` : `${name} ${version} (GitHub release ${tag} of ${repo})`);

export { wheelLabel };
