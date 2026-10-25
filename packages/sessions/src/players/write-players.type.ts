/* @layer core @kind types */
import type { PresetStore } from '@archipelia/presets';
import type { DataFiles, GameSchema } from '@archipelia/model';

type PlayerSources = { presets: Pick<PresetStore, 'get'>; schemaOf: (game: string) => Promise<GameSchema | undefined> };

type PlayerDeps = PlayerSources & { files: DataFiles };

export type { PlayerDeps, PlayerSources };
