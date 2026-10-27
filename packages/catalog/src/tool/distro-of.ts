/* @layer core @kind logic */
import { IMMUTABLE_VARIANTS, MANAGER_BY_ID } from './tool.constants';
import type { Distro, ImmutableFamily, PackageManager } from './tool.type';
import { parseOsRelease } from './parse-os-release';

const idsOf = (fields: Record<string, string>): string[] =>
  [fields.ID ?? '', ...(fields.ID_LIKE ?? '').split(/\s+/)].map((id) => id.toLowerCase()).filter((id) => id !== '');

const managerOf = (ids: string[]): PackageManager | undefined => {
  const found = ids.find((id) => MANAGER_BY_ID[id] !== undefined);
  return found === undefined ? undefined : MANAGER_BY_ID[found];
};

const immutableOf = (ids: string[], variant: string, ostree: boolean): ImmutableFamily | undefined => {
  if (ids.includes('steamos')) return 'steamos';
  if (ids.includes('nixos')) return 'nixos';
  const atomic = IMMUTABLE_VARIANTS.some((name) => variant.toLowerCase().includes(name)) || ids.some((id) => id.includes('microos'));
  return ostree || atomic ? 'ostree' : undefined;
};

const distroOf = (osRelease: string, ostree: boolean): Distro => {
  const fields = parseOsRelease(osRelease);
  const ids = idsOf(fields);
  return {
    name: fields.PRETTY_NAME ?? fields.NAME ?? fields.ID ?? 'Linux',
    manager: managerOf(ids),
    immutable: immutableOf(ids, fields.VARIANT_ID ?? '', ostree),
  };
};

export { distroOf };
