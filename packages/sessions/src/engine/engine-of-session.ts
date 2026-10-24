/* @layer core @kind logic */
import type { Session, SessionEngine } from '@archipelia/model';
import { LEGACY_ENGINE } from './legacy-engine.constants';

const engineOfSession = (session: Pick<Session, 'engine'>): SessionEngine => session.engine ?? LEGACY_ENGINE;

export { engineOfSession };
