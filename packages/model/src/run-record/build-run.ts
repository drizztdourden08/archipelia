/* @layer core @kind logic */
import type { Session } from '../session.type';
import type { RunBuild } from './run-record.type';
import { runOverridesOf } from './run-overrides-of';

const buildRun = ({ id, createdAt, saved, used, players, status = 'generating' }: RunBuild): Session => ({
  id,
  templateId: saved.id,
  snapshot: used,
  status,
  createdAt,
  source: { sessionId: saved.id, sessionName: saved.name, overrides: runOverridesOf(saved, used), match: 'recorded' },
  players,
});

export { buildRun };
