/* @layer core @kind types */
import type { PresetStore } from '@archipelia/presets';
import type { DataFiles, GameSchema } from '@archipelia/model';

type PlayerDeps = { files: DataFiles; presets: PresetStore; schemaOf: (game: string) => Promise<GameSchema | undefined> };

export type { PlayerDeps };
