/* @layer core @kind logic */
import { DEFAULT_MIRROR_URL, getTrustedRoot } from '@sigstore/tuf';
import { TUF_TIMEOUT_MS } from './trusted-root.constants';
import type { FetchTrustedRoot } from './trusted-root.type';

const fetchTrustedRoot: FetchTrustedRoot = (cachePath) =>
  getTrustedRoot({ cachePath, mirrorURL: DEFAULT_MIRROR_URL, timeout: TUF_TIMEOUT_MS });

export { fetchTrustedRoot };
