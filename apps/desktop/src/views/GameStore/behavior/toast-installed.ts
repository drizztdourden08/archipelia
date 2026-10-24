/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import type { InstalledGame } from '@archipelia/model';

const toastInstalled = (game: InstalledGame): void => {
  toast(`Installed ${game.game} ${game.version}`, { variant: 'success' });
  if (game.trust?.state === 'unverified') toast(`${game.game}: ${game.trust.detail}`, { variant: 'warning' });
};

export { toastInstalled };
