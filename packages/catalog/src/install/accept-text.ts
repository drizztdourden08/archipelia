/* @layer core @kind logic */
import { packagePlural } from './package-plural';

const acceptText = (label: string, packages: string[]) =>
  `${label} needs the Python ${packagePlural(packages)} ${packages.join(', ')}. Nothing is installed into the engine until you accept.`;

export { acceptText };
