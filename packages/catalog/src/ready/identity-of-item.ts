/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { Identity } from './identity-of-item.type';
import { FULL_NAME, WORLD_TOPIC } from './ready.constants';

const isId = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value > 0;

const topicsOf = (value: unknown): string[] => (Array.isArray(value) ? value.filter((topic): topic is string => typeof topic === 'string') : []);

const identityOfItem = (item: Record<string, unknown>): Identity | undefined => {
  const { id, full_name: fullName, owner } = item;
  const login = isRecord(owner) ? owner.login : undefined;
  const topics = topicsOf(item.topics);
  const valid = isId(id) && typeof fullName === 'string' && FULL_NAME.test(fullName) && typeof login === 'string' && topics.includes(WORLD_TOPIC);
  return valid ? { id, fullName, owner: login, topics } : undefined;
};

export { identityOfItem };
