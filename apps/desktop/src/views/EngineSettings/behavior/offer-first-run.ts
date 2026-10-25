/* @layer renderer-app @kind logic */
import { confirmAction, confirmChoice } from '@drizztdourden08/brock-react';
import { engineStartupDeps } from '../../../hooks/engine-startup/engine-startup-deps';
import { runEngineStartup } from '../../../hooks/engine-startup/run-engine-startup';
import type { AppSettings } from '../../../settings.type';

const offerFirstRun = (settings: AppSettings): Promise<void> =>
  runEngineStartup({ confirmAction, confirmChoice, settings: { get: () => settings } }, engineStartupDeps());

export { offerFirstRun };
