/* @layer renderer-app @kind logic */
import type { GameCardNote } from '@archipelia/design';
import type { GameRow } from '../GameStore.type';
import { ALSO_IN_INDEX, NOT_REVIEWED, UNLISTED_DIRECT } from '../GameStore.constants';

const reviewNotes = ({ entry, installed }: GameRow): GameCardNote[] => {
  const { discovered } = entry;
  if (!discovered) return [];
  const notReviewed: GameCardNote[] = installed?.trust ? [] : [{ icon: 'triangle-alert', text: NOT_REVIEWED, warning: true }];
  const index: GameCardNote[] = discovered.alsoInIndex ? [{ icon: 'info', text: ALSO_IN_INDEX }] : [];
  const unlisted: GameCardNote[] = discovered.direct ? [{ icon: 'plug-zap', text: UNLISTED_DIRECT }] : [];
  return [...notReviewed, ...index, ...unlisted];
};

export { reviewNotes };
