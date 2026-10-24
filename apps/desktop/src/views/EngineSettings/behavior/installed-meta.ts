/* @layer renderer-app @kind logic */
import type { InstalledEngine } from '@archipelia/model';
import type { WhenText } from '../EngineSettings.type';

const installedMeta = (engine: InstalledEngine, when: WhenText): string => `Python ${engine.python}, built ${when(engine.builtAt, 'day')}`;

export { installedMeta };
