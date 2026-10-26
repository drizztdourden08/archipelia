/* @layer renderer-app @kind logic */
import type { ConsentWheel } from '../../../PackageConsentDialog.type';

const wheelLink = ({ repo, tag, built, commit }: ConsentWheel): string =>
  (built === true && commit ? `https://github.com/${repo}/tree/${commit}` : `https://github.com/${repo}/releases/tag/${encodeURIComponent(tag)}`);

export { wheelLink };
