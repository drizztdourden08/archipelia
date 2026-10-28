/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { identityOfItem } from './identity-of-item';
import { DIRECT_TOPIC } from './ready.constants';
import type { ReadyRepo } from './ready.type';

const isOff = (item: Record<string, unknown>) => item.fork === true || item.archived === true || item.disabled === true;

const numberOr = (value: unknown): number => (typeof value === 'number' ? value : 0);

const textOr = (value: unknown): string => (typeof value === 'string' ? value : '');

const repoOfItem = (item: unknown): ReadyRepo[] => {
  if (!isRecord(item) || isOff(item)) return [];
  const identity = identityOfItem(item);
  if (!identity) return [];
  const { id, fullName, owner, topics } = identity;
  return [{
    id, fullName, owner, stars: numberOr(item.stargazers_count),
    pushedAt: textOr(item.pushed_at), createdAt: textOr(item.created_at), direct: topics.includes(DIRECT_TOPIC),
  }];
};

export { repoOfItem };
