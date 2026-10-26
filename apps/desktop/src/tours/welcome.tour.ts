/* @layer renderer-app @kind config */
import { defineTour } from '@drizztdourden08/brock-react';
import { APP_STEPS } from './app.constants';
import { HOME_STEPS } from './home.constants';
import { HOSTING_STEPS } from './hosting.constants';
import { INTRO_STEPS } from './intro.constants';
import { GAMES_STEPS, PRESETS_STEPS } from './library.constants';
import { SESSIONS_STEPS } from './sessions.constants';
import { SHELL_STEPS } from './shell.constants';

export default defineTour({
  id: 'welcome',
  title: 'Welcome to Archipelia',
  description: 'A walk through every part of Archipelia, from the engine to your first hosted multiworld.',
  trigger: 'first-run',
  steps: [...INTRO_STEPS, ...HOME_STEPS, ...SESSIONS_STEPS, ...GAMES_STEPS, ...PRESETS_STEPS, ...HOSTING_STEPS, ...APP_STEPS, ...SHELL_STEPS],
});
