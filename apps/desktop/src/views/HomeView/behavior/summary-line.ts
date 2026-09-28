/* @layer renderer-app @kind logic */
import type { EngineStatus } from '@archipelia/model';
import { engineHeadline } from './engine-headline';
import type { HomeCounts } from '../HomeView.type';
import { plural } from './plural';

const engineLine = (status: EngineStatus | null) => {
  if (status?.state !== 'ready') return engineHeadline(status);
  return status.apVersion ? `Engine AP ${status.apVersion} ready` : 'Engine ready';
};

const summaryLine = (status: EngineStatus | null, counts: HomeCounts) => [
  engineLine(status),
  `${plural(counts.games, 'game')} installed`,
  plural(counts.presets, 'preset'),
  plural(counts.templates, 'template'),
].join(' · ');

export { summaryLine };
