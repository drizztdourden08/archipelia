/* @layer core @kind logic */
import type { PackageNeed } from '@archipelia/model';
import { packagePlural } from './package-plural';

const detailOf = ({ githubUrl }: PackageNeed) => (githubUrl ? `not on PyPI, only on GitHub: ${githubUrl}` : 'not on PyPI');

const unavailableText = (label: string, needs: PackageNeed[]) =>
  `${label} needs the Python ${packagePlural(needs.map((need) => need.name))} ${needs.map((need) => `${need.name} (${detailOf(need)})`).join(', ')}. Archipelia only installs packages from PyPI.`;

export { unavailableText };
