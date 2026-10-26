/* @layer core @kind logic */
import type { PackageSource } from '@archipelia/model';

const wheelLabel = ({ name, version, tag, repo }: PackageSource): string => `${name} ${version} (GitHub release ${tag} of ${repo})`;

export { wheelLabel };
