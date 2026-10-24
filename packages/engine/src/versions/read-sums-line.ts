/* @layer core @kind logic */
import type { PythonBuild } from '@archipelia/model';
import { SUMS_LINE } from './feed-sources.constants';

const readSumsLine = (line: string, file: RegExp): Pick<PythonBuild, 'version' | 'file' | 'sha256'> | undefined => {
  const [, sha256, name] = SUMS_LINE.exec(line.trim()) ?? [];
  const version = name ? file.exec(name)?.[1] : undefined;
  return sha256 && name && version ? { version, file: name, sha256 } : undefined;
};

export { readSumsLine };
