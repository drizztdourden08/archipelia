/* @layer renderer-app @kind types */
import type { CatalogEntry, CatalogVersion, InstalledGame } from '@archipelia/model';
import type { InstallRequest } from '@archipelia/catalog';

type CardHandlers = {
  isBusy: (key: string) => boolean;
  errorOf: (key: string) => string | null;
  open: (row: GameRow) => void;
  installWorld: (request: InstallRequest, key: string) => void;
  remove: (row: GameRow) => void;
  openHome: (url: string) => void;
};

type GameRowState = 'installed' | 'update' | 'available';

type GameTab = 'all' | 'installed' | 'official' | 'community' | 'updates';

type GameSectionId = 'installed' | 'official' | 'community' | 'updates';

type GameStoreProps = { tab: GameTab };

type GameRow = { entry: CatalogEntry; installed?: InstalledGame; latest?: CatalogVersion; state: GameRowState };

type GameSectionRows = { id: GameSectionId; rows: GameRow[] };

type EmptyKind = 'loading' | 'search' | 'none' | 'installed' | 'updates';

type GameRecord = { name: string; source: string; state: string; fit: string; stability: string; tags: string[] };

type GameSummary = { worlds: number; installed: number; updates: number; noRelease: number; shown: number; apVersion?: string };

export type { CardHandlers, EmptyKind, GameRecord, GameRow, GameRowState, GameSectionId, GameSectionRows, GameStoreProps, GameSummary, GameTab };
