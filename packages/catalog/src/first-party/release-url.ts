/* @layer core @kind logic */
import { RELEASE_HOST } from './first-party.constants';

const releaseUrl = (repo: string, asset: string) => `${RELEASE_HOST}/${repo}/releases/latest/download/${encodeURIComponent(asset)}`;

export { releaseUrl };
