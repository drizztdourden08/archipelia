/* @layer renderer-app @kind logic */
import type { EngineStatus } from '@archipelia/model';
import type { HomeStep } from '../HomeView.type';
import { HERO_TITLE } from '../HomeView.constants';

const heroTitle = (status: EngineStatus | null, next: HomeStep | null, hasRun: boolean): string => {
  if (!status) return HERO_TITLE.checking;
  if (status.state === 'building') return HERO_TITLE.building;
  if (status.state !== 'ready') return HERO_TITLE.engine;
  if (hasRun) return HERO_TITLE.ready;
  return next ? HERO_TITLE[next.id] : HERO_TITLE.run;
};

export { heroTitle };
