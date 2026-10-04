/* @layer renderer-app @kind types */
import type { HeroSlots } from '@drizztdourden08/brock-react';
import type { EngineStatus, GamePreset, InstalledGame, Session } from '@archipelia/model';

type HomeCounts = { games: number; presets: number; sessions: number };

type HomeViewProps = { slots: HeroSlots };

type HomeStepId = 'engine' | 'games' | 'preset' | 'session';

type HomeStep = { id: HomeStepId; label: string; done: boolean; meta: string; action: string };

type HomeStepsInput = {
  status: EngineStatus | null;
  installed: readonly InstalledGame[];
  presets: readonly GamePreset[];
  sessions: number;
};

type HeroAction = { id: string; label: string; primary: boolean; disabled?: boolean };

type HeroActionsInput = { engineNeeded: boolean; next: HomeStep | null; last: Session | null; busy: boolean };

type HomeFactsInput = {
  last: Session | null;
  now: number;
  status: EngineStatus | null;
  counts: HomeCounts;
  installed: readonly InstalledGame[];
  presets: readonly GamePreset[];
};

export type { HeroAction, HeroActionsInput, HomeFactsInput, HomeStep, HomeStepId, HomeStepsInput, HomeViewProps };
