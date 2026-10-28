/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { isRepoId } from './is-repo-id';
import type { Parsed } from './parsed.type';
import type { RegistryBlocked } from './registry.type';

const parseBlocked = (value: unknown): Parsed<RegistryBlocked> => {
  if (!isRecord(value) || !isRepoId(value.repoId)) return { problem: 'a blocked repository needs a numeric repoId' };
  const { repoId, reason } = value;
  return { value: typeof reason === 'string' && reason.length > 0 ? { repoId, reason } : { repoId } };
};

export { parseBlocked };
