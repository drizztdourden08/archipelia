/* @layer core @kind logic */
import type { PythonBuild } from '@archipelia/model';
import { compareVersions } from './compare-versions';
import { TARGET_TRIPLES } from './feed-sources.constants';
import { readSumsLine } from './read-sums-line';
import { versionLine } from './version-line';

const escapePattern = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePythonBuilds = (sums: string, release: string, target: string): PythonBuild[] => {
  const triple = TARGET_TRIPLES[target];
  if (!triple) return [];
  const file = new RegExp(`^cpython-(\\d+\\.\\d+\\.\\d+)\\+${escapePattern(release)}-${escapePattern(triple)}-install_only\\.tar\\.gz$`);
  const newest = new Map<string, PythonBuild>();
  sums.split(/\r?\n/).forEach((line) => {
    const found = readSumsLine(line, file);
    if (!found) return;
    const kept = newest.get(versionLine(found.version));
    if (!kept || compareVersions(found.version, kept.version) > 0) newest.set(versionLine(found.version), { ...found, release, target });
  });
  return [...newest.values()].sort((a, b) => compareVersions(b.version, a.version));
};

export { parsePythonBuilds };
