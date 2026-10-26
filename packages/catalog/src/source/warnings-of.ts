/* @layer core @kind logic */
import type { SourceWarning } from '@archipelia/model';
import { DAY_MS } from '../enrich/enrich.constants';
import { FEW_STARS, NEW_PROJECT_DAYS } from './source.constants';
import type { RepoFacts } from './source.type';

const isNew = (createdAt: string | undefined, now: number) => {
  const created = Date.parse(createdAt ?? '');
  return !Number.isNaN(created) && now - created < NEW_PROJECT_DAYS * DAY_MS;
};

const warningsOf = ({ archived, createdAt, stars, fork }: RepoFacts, now: number): SourceWarning[] => [
  ...(archived ? ['archived' as const] : []),
  ...(isNew(createdAt, now) ? ['new' as const] : []),
  ...(stars < FEW_STARS ? ['few-stars' as const] : []),
  ...(fork ? ['fork' as const] : []),
];

export { warningsOf };
