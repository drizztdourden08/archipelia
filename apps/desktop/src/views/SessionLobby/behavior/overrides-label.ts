/* @layer renderer-app @kind logic */
import type { SetPlayer } from '@archipelia/model';

const overridesLabel = ({ source }: SetPlayer) => {
  if (source.kind === 'yaml') return 'from file';
  const count = Object.keys(source.overrides).length;
  return count ? `${count} changed` : 'none';
};

export { overridesLabel };
