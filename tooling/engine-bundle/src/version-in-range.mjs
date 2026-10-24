/* @layer tooling-scripts @kind logic */
import { compareVersions } from './compare-versions.mjs';

const COMPARATOR = /^(>=|<=|>|<|=)?(\d+(?:\.\d+){0,2})$/;

const HOLDS = {
  '>=': (order) => order >= 0,
  '>': (order) => order > 0,
  '<=': (order) => order <= 0,
  '<': (order) => order < 0,
  '=': (order) => order === 0,
};

const versionInRange = (version, range) =>
  range
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .every((word) => {
      const match = COMPARATOR.exec(word);
      if (!match?.[2]) throw new Error(`"${word}" is not a version comparator`);
      return HOLDS[match[1] ?? '='](compareVersions(version, match[2]));
    });

export { versionInRange };
