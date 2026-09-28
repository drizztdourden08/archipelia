/* @layer renderer-app @kind logic */
import type { EngineStatus } from '@archipelia/model';
import { ENGINE_META } from '../HomeView.constants';

const engineMeta = (status: EngineStatus | null) => status?.error ?? (status ? ENGINE_META[status.state] : 'checking');

export { engineMeta };
