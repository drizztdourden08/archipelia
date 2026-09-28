/* @layer renderer-app @kind logic */
import type { EngineStatus } from '@archipelia/model';
import { HEADLINE } from '../HomeView.constants';

const engineHeadline = (status: EngineStatus | null) => (status ? HEADLINE[status.state] : 'Checking the engine');

export { engineHeadline };
