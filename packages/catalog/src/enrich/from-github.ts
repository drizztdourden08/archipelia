/* @layer core @kind logic */
import type { EnrichRecord, GithubParams, ReleaseFiles } from './enrich.type';
import { RECORD_VERSION } from './enrich.constants';
import { fetchArt } from './fetch-art';
import { fetchReadme } from './fetch-readme';
import { readReleaseFiles } from './read-release-files';
import { readmeFields } from './readme-fields';

const docsOf = async ({ fetch: net, repo }: GithubParams, same: EnrichRecord | undefined, files: ReleaseFiles): Promise<Partial<EnrichRecord>> => {
  if (files.markdown) return { markdown: files.markdown };
  const read = await fetchReadme({ fetch: net, repo, etag: same?.etag, url: same?.readmeUrl });
  return read.kind === 'same' ? (same ?? {}) : readmeFields(read, repo);
};

const fromGithub = async (params: GithubParams): Promise<EnrichRecord> => {
  const { fetch: net, repo, release, tag, stamp, old, now } = params;
  const same = old?.stamp === stamp ? old : undefined;
  const files = release ? await readReleaseFiles(net, release, tag) : {};
  const docs = await docsOf(params, same, files);
  const art = files.art ?? same?.art ?? await fetchArt(net, repo).catch(() => undefined);
  return { ...docs, version: RECORD_VERSION, stamp, fetchedAt: now, ...(art ? { art } : {}) };
};

export { fromGithub };
