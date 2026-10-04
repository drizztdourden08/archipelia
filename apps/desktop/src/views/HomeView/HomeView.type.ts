/* @layer renderer-app @kind types */
import type { HeroSlots } from '@drizztdourden08/brock-react';
import type { EngineStatus, GamePreset, InstalledGame, Session } from '@archipelia/model';

type HomeCounts = { games: number; presets: number; templates: number };

type HomeViewProps = { slots: HeroSlots };

type HomeFactsInput = {
  last: Session | null;
  now: number;
  status: EngineStatus | null;
  counts: HomeCounts;
  installed: readonly InstalledGame[];
  presets: readonly GamePreset[];
};

export type { HomeFactsInput, HomeViewProps };
