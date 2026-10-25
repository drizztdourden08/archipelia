/* @layer core @kind logic */
import { parseRequirements } from '@archipelia/engine';
import type { ApworldInfo } from './read-apworld.type';
import { refusedText } from './refused-text';

const worldPackages = (info: ApworldInfo, label: string): string[] => {
  const { packages, refused } = parseRequirements(info.requirements);
  const [first] = refused;
  if (first !== undefined) throw new Error(refusedText(label, first));
  return packages;
};

export { worldPackages };
