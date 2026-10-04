/* @layer renderer-app @kind logic */
import type { HomeStep, HomeStepId, HomeStepsInput } from '../HomeView.type';
import { STEP_TEXT } from '../HomeView.constants';
import { gamesMeta } from './games-meta';
import { plural } from './plural';

const stepOf = (id: HomeStepId, done: boolean, doneMeta: string): HomeStep => {
  const text = STEP_TEXT[id];
  return { id, label: text.label, done, meta: done ? doneMeta : text.todo, action: text.action };
};

const homeSteps = ({ status, installed, presets, sessions }: HomeStepsInput): HomeStep[] => [
  stepOf('engine', status?.state === 'ready', status?.apVersion ? `Archipelago ${status.apVersion}` : 'Ready'),
  stepOf('games', installed.length > 0, gamesMeta(installed)),
  stepOf('preset', presets.length > 0, plural(presets.length, 'preset')),
  stepOf('session', sessions > 0, `${plural(sessions, 'session')} saved`),
];

export { homeSteps };
