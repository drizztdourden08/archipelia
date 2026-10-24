/* @layer tests @kind test */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeDomains } from '@archipelia/server/node';

const tempFiles = async (domain: string) => {
  const dir = await mkdtemp(join(tmpdir(), 'archipelia-entries-'));
  return { files: createNodeDomains(dir).domain(domain), remove: () => rm(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }) };
};

export { tempFiles };
