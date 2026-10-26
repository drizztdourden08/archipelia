/* @layer core @kind logic */
import { parseRequirements } from '@archipelia/engine';
import { refusedText } from '../install/refused-text';

const safeRequires = (asset: string, requires: readonly string[]): string[] =>
  requires.map((line) => {
    const { packages, refused } = parseRequirements(line);
    const [plain] = packages;
    if (refused.length > 0 || packages.length !== 1 || plain === undefined) throw new Error(refusedText(asset, line));
    return plain;
  });

export { safeRequires };
