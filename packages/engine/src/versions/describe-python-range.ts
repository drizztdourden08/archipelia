/* @layer core @kind logic */
import type { PythonRange } from '@archipelia/model';
import { versionParts } from './version-parts';

const lastLine = (maxExclusive: string): string => {
  const [major = 0, minor = 0, patch = 0] = versionParts(maxExclusive);
  if (patch === 0 && minor > 0) return `${major}.${minor - 1}.x`;
  return `below ${maxExclusive}`;
};

const describePythonRange = (range: PythonRange): string => {
  if (!range.maxExclusive) return `${range.min} or newer`;
  const last = lastLine(range.maxExclusive);
  return last.startsWith('below') ? `${range.min} ${last}` : `${range.min} to ${last}`;
};

export { describePythonRange };
