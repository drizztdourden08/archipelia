/* @layer core @kind logic */
import type { EnrichRecord, GithubParams } from './enrich.type';
import { RECORD_VERSION } from './enrich.constants';
import { fetchArt } from './fetch-art';
import { fetchReadme } from './fetch-readme';
import { readmeFields } from './readme-fields';

const fromGithub = async ({ fetch: net, repo, stamp, old, now }: GithubParams): Promise<EnrichRecord> => {
  const same = old?.stamp === stamp ? old : undefined;
  const read = await fetchReadme({ fetch: net, repo, etag: same?.etag, url: same?.readmeUrl });
  const art = same?.art ?? await fetchArt(net, repo).catch(() => undefined);
  const kept = read.kind === 'same' ? same : undefined;
  return { ...(kept ?? readmeFields(read, repo)), version: RECORD_VERSION, stamp, fetchedAt: now, ...(art ? { art } : {}) };
};

export { fromGithub };
