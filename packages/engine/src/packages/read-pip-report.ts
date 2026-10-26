/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { ResolvedPackage } from './resolved-package.type';
import { normalizePackageName } from './normalize-package-name';
import { SAFE, SHA256_HEX } from './read-pip-report.constants';

const archiveInfoOf = (value: Record<string, unknown>): Record<string, unknown> => {
  const download = value.download_info;
  const info = isRecord(download) ? download.archive_info : undefined;
  return isRecord(info) ? info : {};
};

const hashTextOf = (info: Record<string, unknown>): unknown => {
  if (isRecord(info.hashes) && typeof info.hashes.sha256 === 'string') return info.hashes.sha256;
  return typeof info.hash === 'string' ? info.hash.replace(/^sha256=/, '') : undefined;
};

const hashOf = (value: Record<string, unknown>): string | undefined => {
  const text = hashTextOf(archiveInfoOf(value));
  return typeof text === 'string' && SHA256_HEX.test(text.toLowerCase()) ? text.toLowerCase() : undefined;
};

const itemOf = (value: unknown): ResolvedPackage | undefined => {
  if (!isRecord(value) || !isRecord(value.metadata)) return undefined;
  const { name, version } = value.metadata;
  if (typeof name !== 'string' || typeof version !== 'string' || !SAFE.test(version) || !SAFE.test(name)) return undefined;
  const clean = normalizePackageName(name);
  const sha256 = hashOf(value);
  return {
    name: clean, version, pin: `${clean}==${version}`, url: `https://pypi.org/project/${clean}/${version}/`, direct: value.requested === true,
    ...(sha256 === undefined ? {} : { sha256 }),
  };
};

const readPipReport = (text: string): ResolvedPackage[] => {
  const unreadable = new Error('pip gave a report Archipelia cannot read');
  let report: unknown;
  try {
    report = JSON.parse(text);
  } catch {
    throw unreadable;
  }
  if (!isRecord(report) || !Array.isArray(report.install)) throw unreadable;
  const items = report.install.map(itemOf);
  if (items.some((item) => item === undefined)) throw unreadable;
  return items.filter((item): item is ResolvedPackage => item !== undefined);
};

export { readPipReport };
