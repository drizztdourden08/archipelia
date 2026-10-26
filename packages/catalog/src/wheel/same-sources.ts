/* @layer core @kind logic */
import type { PackageSource } from '@archipelia/model';

const keyOf = (source: PackageSource) =>
  [source.sha256, source.repo, source.tag, source.asset, source.name, source.version, source.verified, source.newest ?? '', source.built === true, source.commit ?? '', source.archiveSha256 ?? ''].join('|');

const sameSources = (left: readonly PackageSource[], right: readonly PackageSource[]): boolean => {
  const wanted = new Set(right.map(keyOf));
  return left.length === right.length && left.every((source) => wanted.has(keyOf(source)));
};

export { sameSources };
