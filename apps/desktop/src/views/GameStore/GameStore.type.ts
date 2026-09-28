/* @layer renderer-app @kind types */
import type { CatalogEntry, CatalogVersion, InstalledGame } from '@archipelia/model';
import type { InstallRequest } from '../../ipc/contract.type';

type CardHandlers = {
  busy: string | null;
  installWorld: (request: InstallRequest, key: string) => void;
  remove: (apworld: string) => void;
  openHome: (url: string) => void;
};

type GameRowState = 'installed' | 'update' | 'available';

type GameTab = 'installed' | 'official' | 'community' | 'updates';

type GameRow = { entry: CatalogEntry; installed?: InstalledGame; latest?: CatalogVersion; state: GameRowState };

export type { CardHandlers, GameRow, GameRowState, GameTab };
