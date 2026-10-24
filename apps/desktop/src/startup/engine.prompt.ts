/* @layer renderer-app @kind logic */
import { defineStartupPrompt } from '@drizztdourden08/brock-react';
import { engineStartupDeps } from '../hooks/engine-startup/engine-startup-deps';
import { runEngineStartup } from '../hooks/engine-startup/run-engine-startup';
import type { AppSettings } from '../settings.type';

export default defineStartupPrompt<AppSettings>({
  order: 10,
  run: (ctx) => runEngineStartup(ctx, engineStartupDeps()),
});
