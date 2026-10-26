/* @layer renderer-app @kind logic */
import type { InstallRequest } from '@archipelia/catalog';
import { acceptedRequest } from './accepted-request';
import type { ConsentParams } from './consented-request.type';

const consentedRequest = async ({ request, title, preview, ask }: ConsentParams): Promise<InstallRequest | undefined> => {
  if (request.kind === 'official') return request;
  const found = await preview(request);
  const sources = found.sources ?? [];
  if (found.packages.length === 0 && sources.length === 0) return request;
  return (await ask(title, found.packages, sources)) ? acceptedRequest(request, found) : undefined;
};

export { consentedRequest };
