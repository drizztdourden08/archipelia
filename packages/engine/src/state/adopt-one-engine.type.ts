/* @layer core @kind types */
import type { EngineDefaults } from '../versions/engine-defaults.type';

type AdoptParams = { engineRoot: string; name: string; defaults: EngineDefaults; target: string };

export type { AdoptParams };
