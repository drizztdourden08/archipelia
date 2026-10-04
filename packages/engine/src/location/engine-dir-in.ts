/* @layer core @kind logic */
import { join } from 'node:path';
import { ENGINE_AP_VERSION } from '../runtime/engine-version.constants';
import { ENGINE_DIR_ENV } from './engine-location.constants';

const engineTarget = () => `${ENGINE_AP_VERSION}-${process.platform}-${process.arch}`;

const engineDirIn = (engineRoot: string) => process.env[ENGINE_DIR_ENV] ?? join(engineRoot, engineTarget());

export { engineDirIn };
