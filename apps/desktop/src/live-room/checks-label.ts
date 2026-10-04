/* @layer renderer-app @kind logic */
import type { PlayerView } from './live-room.type';

const checksLabel = ({ checked, total }: PlayerView) => {
  if (checked === null) return 'no checks seen';
  return total === null ? `${checked} checks` : `${checked} / ${total}`;
};

export { checksLabel };
