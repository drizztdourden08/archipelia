/* @layer core @kind types */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { PresetStore } from '@archipelia/presets';
import type { GameSchema } from '@archipelia/model';

type PlayerDeps = { files: FileStore; presets: PresetStore; schemaOf: (game: string) => Promise<GameSchema | undefined> };

export type { PlayerDeps };
