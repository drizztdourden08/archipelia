/* @layer renderer-app @kind logic */
import { formatBytes } from '@drizztdourden08/brock-core/format';
import type { EngineEntry } from '@archipelia/model';
import type { WhenText } from '../EngineSettings.type';

const sessionsText = (count: number) => (count === 1 ? '1 session' : `${count} sessions`);

const installedMeta = (engine: EngineEntry, when: WhenText): string => [
  `Python ${engine.python}`,
  engine.bytes === undefined ? undefined : formatBytes(engine.bytes),
  `built ${when(engine.builtAt, 'day')}`,
  engine.sessions > 0 ? sessionsText(engine.sessions) : undefined,
].filter((part) => part !== undefined).join(', ');

export { installedMeta };
