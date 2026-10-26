/* @layer core @kind logic */
import type { WheelSite } from './wheel.type';

const releaseAssetUrl = ({ owner, repo, tag, asset }: WheelSite): string =>
  `https://github.com/${owner}/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(asset)}`;

export { releaseAssetUrl };
