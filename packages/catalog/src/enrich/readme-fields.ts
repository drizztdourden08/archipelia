/* @layer core @kind logic */
import type { EnrichRecord, GithubRepo, ReadmeRead } from './enrich.type';
import { markdownOf } from './markdown-of';

const readmeFields = (read: ReadmeRead, repo: GithubRepo): Partial<EnrichRecord> => {
  if (read.kind !== 'text') return {};
  const markdown = markdownOf(read.text, repo);
  return { ...(markdown ? { markdown } : {}), readmeUrl: read.url, ...(read.etag ? { etag: read.etag } : {}) };
};

export { readmeFields };
