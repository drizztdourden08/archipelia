/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import type { InstalledGame } from '@archipelia/model';

const toastInstalled = (game: InstalledGame): void => {
  toast(`Installed ${game.game} ${game.version}`, { variant: 'success' });
};

export { toastInstalled };
