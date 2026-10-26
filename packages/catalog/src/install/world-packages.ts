/* @layer core @kind logic */
import { parseRequirements } from '@archipelia/engine';
import type { ApworldInfo } from './read-apworld.type';
import { needOfLine } from './need-of-line';
import { PackageUnavailableError } from './package-unavailable-error';
import { refusedText } from './refused-text';
import { unavailableText } from './unavailable-text';

const worldPackages = (info: ApworldInfo, label: string): string[] => {
  const { packages, refused } = parseRequirements(info.requirements);
  const [first] = refused;
  if (first === undefined) return packages;
  const need = needOfLine(first);
  if (need) throw new PackageUnavailableError(unavailableText(label, [need]), [need]);
  throw new Error(refusedText(label, first));
};

export { worldPackages };
