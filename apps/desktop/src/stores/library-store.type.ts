/* @layer renderer-app @kind types */
import type { CatalogEntry, GamePreset, InstalledGame, SessionTemplate } from '@archipelia/model';
import type { PresetInput } from '@archipelia/presets';
import type { CatalogView, InstallRequest } from '@archipelia/catalog';

type LibraryState = {
  installed: InstalledGame[];
  catalog: CatalogView | null;
  official: CatalogEntry[];
  presets: GamePreset[];
  templates: SessionTemplate[];
  loadGames: (refreshCatalog?: boolean) => Promise<void>;
  loadInstalled: () => Promise<void>;
  install: (request: InstallRequest) => Promise<InstalledGame>;
  removeGame: (apworld: string) => Promise<void>;
  loadPresets: () => Promise<void>;
  createPreset: (preset: PresetInput) => Promise<GamePreset>;
  savePreset: (preset: GamePreset) => Promise<GamePreset>;
  duplicatePreset: (id: string, name: string) => Promise<GamePreset>;
  removePreset: (id: string) => Promise<void>;
  loadTemplates: () => Promise<void>;
  saveTemplate: (template: SessionTemplate) => Promise<SessionTemplate>;
  removeTemplate: (id: string) => Promise<void>;
};

export type { LibraryState };
