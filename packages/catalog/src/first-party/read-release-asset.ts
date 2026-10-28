/* @layer core @kind logic */
import { readConditionalAsset } from './read-conditional-asset';
import { MAX_ASSET_BYTES } from './read-release-asset.constants';

const readReleaseAsset = async (url: string, request: typeof fetch, max = MAX_ASSET_BYTES): Promise<unknown> => {
  const read = await readConditionalAsset(url, request, { max });
  return read.kind === 'found' ? read.value : null;
};

export { readReleaseAsset };
