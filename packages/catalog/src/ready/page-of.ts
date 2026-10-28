/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { nextLink } from './next-link';
import type { ReadyPage } from './ready.type';

const pageOf = async (res: Response): Promise<ReadyPage> => {
  const body: unknown = await res.json();
  const items = isRecord(body) && Array.isArray(body.items) ? (body.items as unknown[]) : [];
  const total = isRecord(body) && typeof body.total_count === 'number' ? body.total_count : items.length;
  const next = nextLink(res.headers.get('link'));
  const tag = res.headers.get('etag');
  return { items, total, ...(next ? { next } : {}), ...(tag ? { etag: tag } : {}) };
};

export { pageOf };
