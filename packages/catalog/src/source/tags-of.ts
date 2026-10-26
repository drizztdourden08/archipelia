/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { TagFact } from './source.type';

const tagsOf = (body: unknown): TagFact[] =>
  (Array.isArray(body) ? body : []).flatMap((item: unknown) => {
    if (!isRecord(item) || typeof item.name !== 'string' || !isRecord(item.commit) || typeof item.commit.sha !== 'string') return [];
    return [{ name: item.name, sha: item.commit.sha }];
  });

export { tagsOf };
