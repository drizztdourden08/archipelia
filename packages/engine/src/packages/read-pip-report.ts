/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { ResolvedPackage } from './resolved-package.type';
import { normalizePackageName } from './normalize-package-name';
import { SAFE } from './read-pip-report.constants';

const itemOf = (value: unknown): ResolvedPackage | undefined => {
  if (!isRecord(value) || !isRecord(value.metadata)) return undefined;
  const { name, version } = value.metadata;
  if (typeof name !== 'string' || typeof version !== 'string' || !SAFE.test(version) || !SAFE.test(name)) return undefined;
  const clean = normalizePackageName(name);
  return {
    name: clean, version, pin: `${clean}==${version}`, url: `https://pypi.org/project/${clean}/${version}/`, direct: value.requested === true,
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
