/* @layer renderer-app @kind logic */
import type { ServerEntry, SessionTemplate } from '@archipelia/model';
import type { RunStats } from '../../../runs/run-stats.type';
import { DATE_FORMAT, TEXT } from '../Sessions.constants';
import { playersLabel } from './players-label';
import { whereLabel } from './where-label';

const sessionSummary = (template: SessionTemplate, servers: readonly ServerEntry[], stats: RunStats | undefined): string => [
  whereLabel(template, [...servers]),
  playersLabel(template.players.length),
  stats ? `last run ${DATE_FORMAT.format(stats.last)}` : TEXT.neverRun,
].join(', ');

export { sessionSummary };
